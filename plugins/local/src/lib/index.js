import path from 'path'

import storage from '@/config/storage'

import SimulationDB from '@/database/simulation'

import Services from '@/services'

import Tools from '@/lib/tools'
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
    'gmsh3D',
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
  const three = await Services.toThree(
    simulationPath,
    path.join(mesh.path, mshFile),
    path.join(mesh.path, partPath)
  )
  callback({ data: three.data, error: three.error })

  if (three.code !== 0)
    throw new Error('Mesh converting process failed. Code ' + three.code)

  return {
    fileName: mshFile,
    originPath: mesh.path,
    renderPath: mesh.path,
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
    index: -1,
    label: 'Simulation',
    log: '',
    status: 'wait'
  }
  tasks.push(simulationTask)
  updateTasks(id, tasks)

  // Meshing
  await Promise.all(
    Object.keys(configuration).map(async (ckey, index) => {
      if (configuration[ckey].meshable) {
        const geometry = configuration[ckey]

        // Task
        const meshingTask = {
          index: index,
          label: 'Mesh',
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
            ({ pid, error, data }) => {
              meshingTask.status = 'process'

              pid && (meshingTask.pid = pid)

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

  try {
    // Build the simulation script
    await Template.render(
      algorithm,
      {
        ...configuration,
        dimension: 3,
        run: {
          ...configuration.run,
          resultPath: 'run/result',
          dataPath: 'run/data'
        }
      },
      {
        location: path.join(simulationPath, 'run'),
        name: id + '.edp'
      }
    )

    // Create paths
    await Tools.createPath(path.join(simulationPath, 'run/result'))
    await Tools.createPath(path.join(simulationPath, 'run/data'))

    // Compute simulation
    const code = await Services.freefem(
      simulationPath,
      path.join('run', id + '.edp'),
      async ({ pid, error, data }) => {
        simulationTask.status = 'process'

        pid && (simulationTask.pid = pid)

        error && (simulationTask.log += 'Error: ' + error + '\n')

        if (
          data &&
          (data.includes('PROCESS VTU FILE') ||
            data.includes('PROCESS DATA FILE'))
        ) {
          const lines = data.split('\n')
          const resultLines = lines.filter((l) =>
            l.includes('PROCESS VTU FILE')
          )
          const dataLines = lines.filter((l) => l.includes('PROCESS DATA FILE'))

          // Put other lines in logs
          const nonResultLines = lines.filter(
            (l) =>
              !l.includes('PROCESS VTU FILE') &&
              !l.includes('PROCESS DATA FILE')
          )
          nonResultLines.forEach((line) => {
            simulationTask.log += line
          })

          // Get result
          await Promise.all(
            resultLines.map(async (line) => {
              // New result
              const resFile = line.replace('PROCESS VTU FILE', '').trim()
              const partPath = resFile.replace('.vtu', '')

              try {
                const three = await Services.toThree(
                  simulationPath,
                  path.join('run/result', resFile),
                  path.join('run/result', partPath)
                )

                if (three.code !== 0) {
                  simulationTask.log +=
                    'Warning: Result converting process failed. Code ' +
                    three.code
                  updateTasks(id, tasks)
                } else if (three.error) {
                  simulationTask.log +=
                    'Warning: Result converting process failed (' +
                    three.error +
                    ')'
                  updateTasks(id, tasks)
                } else {
                  const results = three.data
                    ?.trim()
                    ?.split('\n')
                    .map((res) => JSON.parse(res))

                  simulationTask.files = [
                    ...(simulationTask.files || []),
                    ...results.map((result) => ({
                      fileName: resFile,
                      originPath: 'run/result',
                      name: result.name,
                      part: 'part.json',
                      partPath: result.path
                    }))
                  ]

                  updateTasks(id, tasks)
                }
              } catch (err) {
                console.error(err)
                simulationTask.log +=
                  'Warning: Unable to convert result file (' + err.message + ')'
                updateTasks(id, tasks)
              }
            })
          )

          // Get data
          await Promise.all(
            dataLines.map(async (line) => {
              // New data
              const dataFile = line.replace('PROCESS DATA FILE', '').trim()

              try {
                // Read file
                const dataPath = path.join(
                  simulationPath,
                  'run',
                  'data',
                  dataFile
                )
                const dataContent = await Tools.readFile(dataPath)

                simulationTask.datas = [
                  ...(simulationTask.datas || []),
                  JSON.parse(dataContent.toString())
                ]
                updateTasks(id, tasks)
              } catch (err) {
                simulationTask.log +=
                  'Warning: Unable to read data file (' + err.message + ')'
                updateTasks(id, tasks)
              }
            })
          )
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

/**
 * Stop tasks
 * @param {Array} tasks Tasks
 */
const stop = async (tasks) => {
  tasks.forEach((task) => {
    if (task.status === 'process') process.kill(task.pid)
  })
}

export default { key, computeMesh, computeSimulation, stop }
