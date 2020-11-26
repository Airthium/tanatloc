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
  const code = await Services.gmsh(
    simulationPath,
    path.join(mesh.path, geoFile),
    path.join(mesh.path, mshFile),
    callback
  )

  if (code !== 0) {
    throw new Error('Meshing process failed. Code ' + code)
  }

  return {
    path: mesh.path,
    file: mshFile
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
                fineness: 'coarse'
              }
            },
            ({ error, data }) => {
              meshingTask.status = 'process'
              error && (meshingTask.log += `Error: ${error}\n`)
              data && (meshingTask.log += `${data}\n`)
              if ((Date.now() - start) % updateDelay === 0)
                updateTasks(id, tasks)
            }
          )
          // Task
          meshingTask.status = 'finish'
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
      result: {
        path: 'run'
      }
    },
    {
      location: path.join(simulationPath, 'run'),
      name: id + '.edp'
    }
  )

  // Task
  const simulationTask = {
    type: 'simulation',
    log: '',
    status: 'wait'
  }
  tasks.push(simulationTask)
  updateTasks(id, tasks)

  try {
    // Compute simulation
    const code = await Services.freefem(
      simulationPath,
      path.join('run', id + '.edp'),
      ({ error, data }) => {
        simulationTask.status = 'process'
        error && (simulationTask.log += `Error: ${error}\n`)
        data && (simulationTask.log += `${data}\n`)
        if ((Date.now() - start) % updateDelay === 0) updateTasks(id, tasks)
      }
    )

    // Task
    simulationTask.status = 'finish'
    updateTasks(id, tasks)

    // check code
    if (code !== 0) {
      throw new Error('Simulating process failed. Code ' + code)
    }
  } catch (err) {
    simulationTask.status = 'error'
    simulationTask.log += 'Fatal error: ' + err.message
    updateTasks(id, tasks)

    throw err
  }
}

export default { computeMesh, computeSimulation }
