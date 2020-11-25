import path from 'path'

import storage from '../../config/storage'

import SimulationDB from '../database/simulation'

import Template from './template'
import Services from '../services'

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
          log: ''
        }
        tasks.push(meshingTask)

        // Build mesh
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
            error && (meshingTask.log += `Error: ${error}\n`)
            data && (meshingTask.log += `${data}\n`)

            SimulationDB.update({ id }, [
              {
                key: 'tasks',
                value: tasks
              }
            ])
          }
        )

        // Save mesh name
        configuration[key].mesh = mesh
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
    log: ''
  }
  tasks.push(simulationTask)

  // Compute simulation
  const code = await Services.freefem(
    simulationPath,
    path.join('run', id + '.edp'),
    ({ error, data }) => {
      error && (simulationTask.log += `Error: ${error}\n`)
      data && (simulationTask.log += `${data}\n`)

      SimulationDB.update({ id }, [
        {
          key: 'tasks',
          value: tasks
        }
      ])
    }
  )

  if (code !== 0) {
    throw new Error('Simulating process failed. Code ' + code)
  }
}

export default { computeMesh, computeSimulation }
