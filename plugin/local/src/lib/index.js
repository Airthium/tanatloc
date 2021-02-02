import path from 'path'

import storage from '@/config/storage'

import SimulationDB from '@/database/simulation'

import Services from '@/services'

import Template from '@/lib/template'

// Plugin key
const key = 'local'

// dB update delay
const updateDelay = 1000 // ms

/**
 * Update tasks
 * @param {string} id Id
 * @param {Array} tasks Tasks
 */
const updateTasks = (id, tasks) => {
  SimulationDB.update({ id }, [
    {
      key: 'tasks',
      value: tasks
    }
  ])
}

/**
 * Compute mesh
 * @param {string} simulationPath Simulation path
 * @param {Object} geometry Geometry
 * @param {Object} mesh Mesh
 */
const computeMesh = async (simulationPath, geometry, mesh, callback) => {
  const geoFile = geometry.file + '.geo'
  const mshFile = geometry.file + '.msh'
  const partPath = geometry.file

  // Render template
  await Template.render(
    './templates/gmsh3D.geo.ejs',
    {
      ...mesh.parameters,
      geometry: path.join(geometry.path, geometry.file)
    },
    {
      location: path.join(simulationPath, mesh.path),
      name: geoFile
    }
  )

  // Compute mesh
  let code = await Services.gmsh(
    simulationPath,
    path.join(mesh.path, geoFile),
    path.join(mesh.path, mshFile),
    callback
  )

  if (code !== 0) throw new Error('Meshing process failed. Code ' + code)

  // Convert mesh
  code = await Services.toThree(
    simulationPath,
    path.join(mesh.path, mshFile),
    path.join(mesh.path, partPath),
    callback
  )

  if (code !== 0)
    throw new Error('Mesh converting process failed. Code ' + code)

  return {
    fileName: mshFile,
    originPath: mesh.path,
    part: 'part.json',
    partPath: path.join(mesh.path, partPath)
  }
}

/**
 * Compute simulation
 * @param {string} simulation Simulation { id }
 * @param {string} algorithm Algorithm
 * @param {Object} configuration Configuration
 */
const computeSimulation = async ({ id }, algorithm, configuration) => {
  // Time
  const start = Date.now()

  // Path
  const simulationPath = path.join(storage.SIMULATION, id)

  // Create tasks
  const tasks = []
  const simulationTask = {
    type: 'simulation',
    log: '',
    status: 'wait'
  }
  tasks.push(simulationTask)
  updateTasks(id, tasks)

  // Meshing
  await Promise.all(
    Object.keys(configuration).map(async (ckey) => {
      if (configuration[ckey].meshable) {
        const geometry = configuration[ckey]

        // Task
        const meshingTask = {
          type: 'mesh',
          log: '',
          status: 'wait'
        }
        tasks.push(meshingTask)
        updateTasks(id, tasks)

        // Check refinements
        const refinements = []
        configuration.boundaryConditions &&
          Object.keys(configuration.boundaryConditions).forEach(
            (boundaryKey) => {
              if (
                boundaryKey === 'index' ||
                boundaryKey === 'title' ||
                boundaryKey === 'done'
              )
                return
              const boundaryCondition =
                configuration.boundaryConditions[boundaryKey]
              if (boundaryCondition.values && boundaryCondition.refineFactor) {
                refinements.push({
                  size: 'factor',
                  factor: boundaryCondition.refineFactor,
                  selected: boundaryCondition.values.flatMap((v) => v.selected)
                })
              }
            }
          )

        // Mesh parameters
        const parameters = {
          size: 'auto',
          fineness: 'normal',
          refinements: refinements
        }

        // Build mesh
        try {
          const mesh = await computeMesh(
            simulationPath,
            {
              path: path.join('..', geometry.file.originPath),
              file: geometry.file.fileName
            },
            {
              path: path.join(geometry.file.originPath + '_mesh'),
              parameters
            },
            ({ error, data }) => {
              meshingTask.status = 'process'
              error && (meshingTask.log += 'Error: ' + error + '\n')
              data && (meshingTask.log += data + '\n')
              if ((Date.now() - start) % updateDelay === 0)
                updateTasks(id, tasks)
            }
          )
          // Task
          meshingTask.status = 'finish'
          meshingTask.file = mesh
          updateTasks(id, tasks)

          // Save mesh name
          configuration[ckey].mesh = mesh
        } catch (err) {
          // Task
          meshingTask.status = 'error'
          meshingTask.log += 'Fatal error: ' + err.message
          updateTasks(id, tasks)

          throw err
        }
      }
    })
  )

  // Build the simulation script
  await Template.render(
    './templates/' + algorithm + '.edp.ejs',
    {
      ...configuration,
      dimension: 3,
      run: {
        ...configuration.run,
        path: 'run'
      }
    },
    {
      location: path.join(simulationPath, 'run'),
      name: id + '.edp'
    }
  )

  try {
    // Compute simulation
    const code = await Services.freefem(
      simulationPath,
      path.join('run', id + '.edp'),
      async ({ error, data }) => {
        simulationTask.status = 'process'
        error && (simulationTask.log += 'Error: ' + error + '\n')

        if (data && data.includes('PROCESS VTU FILE')) {
          // New result
          const resFile = data.replace('PROCESS VTU FILE', '').trim()
          const partPath = resFile.replace('.vtu', '')

          const results = []

          try {
            const resCode = await Services.toThree(
              simulationPath,
              path.join('run', resFile),
              path.join('run', partPath),
              ({ error: resError, data: resData }) => {
                if (resError) {
                  simulationTask.log += 'Warning: ' + resError
                  updateTasks(id, tasks)
                }

                if (resData) {
                  try {
                    const jsonData = JSON.parse(resData)
                    results.push(jsonData)
                  } catch (err) {
                    simulationTask.log += 'Warning: ' + err.message
                    updateTasks(id, tasks)
                  }
                }
              }
            )

            if (resCode !== 0) {
              simulationTask.log +=
                'Warning: Result converting process failed. Code ' + resCode
              updateTasks(id, tasks)
            } else {
              simulationTask.files = [
                ...(simulationTask.files || []),
                ...results.map((result) => ({
                  fileName: resFile,
                  originPath: 'run',
                  name: result.name,
                  part: 'part.json',
                  partPath: result.path
                }))
              ]

              updateTasks(id, tasks)
            }
          } catch (err) {
            simulationTask.log += 'Warning: ' + err.message
            updateTasks(id, tasks)
          }
        } else {
          // This is just some log
          data && (simulationTask.log += data + '\n')
        }

        if ((Date.now() - start) % updateDelay === 0) updateTasks(id, tasks)
      }
    )

    // Task
    simulationTask.status = 'finish'
    updateTasks(id, tasks)

    // check code
    if (code !== 0) throw new Error('Simulating process failed. Code ' + code)
  } catch (err) {
    // Task
    simulationTask.status = 'error'
    simulationTask.log += 'Fatal error: ' + err.message
    updateTasks(id, tasks)

    throw err
  }
}

export default { key, computeMesh, computeSimulation }
