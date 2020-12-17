/** @module src/lib/compute */

import path from 'path'

import storage from '../../config/storage'

import SimulationDB from '../database/simulation'

import Template from './template'
import Services from '../services'

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
 * @param {string} simulationPath Simulation path
 * @param {Object} configuration Configuration
 */
const computeSimulation = async ({ id }, configuration) => {
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
    Object.keys(configuration).map(async (key) => {
      if (configuration[key].meshable) {
        const geometry = configuration[key]

        // Task
        const meshingTask = {
          type: 'mesh',
          log: '',
          status: 'wait'
        }
        tasks.push(meshingTask)
        updateTasks(id, tasks)

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
              parameters: {
                size: 'auto',
                fineness: 'normal'
              }
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
          configuration[key].mesh = mesh
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
    './templates/poisson.edp.ejs',
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

        // New result
        if (data && data.toString().includes('PROCESS VTU FILE')) {
          const resFile = data.toString().replace('PROCESS VTU FILE', '').trim()
          const partPath = resFile.replace('.vtu', '')

          const results = []

          try {
            const resCode = await Services.toThree(
              simulationPath,
              path.join('run', resFile),
              path.join('run', partPath),
              ({ error, data }) => {
                error && console.error(error)

                if (data) {
                  try {
                    const jsonData = JSON.parse(data)
                    console.log(jsonData)
                    results.push(jsonData)
                  } catch (err) {
                    console.error(err)
                  }
                }
              }
            )

            if (resCode !== 0)
              console.warn('Result converting process failed. Code ' + resCode)
            else {
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
            console.error(err)
          }
        } else if (data) {
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

export default { computeMesh, computeSimulation }
