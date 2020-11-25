import path from 'path'

import Template from './template'
import Services from '../services'

/**
 * Compute mesh
 * @param {string} simulationPath Simulation path
 * @param {Object} geometry Geometry
 * @param {Object} mesh Mesh
 */
const computeMesh = async (simulationPath, geometry, mesh) => {
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
    path.join(mesh.path, mshFile)
  )

  if (code !== 0) {
    throw new Error('Meshing process failed. Code ' + code)
  }

  return {
    path: mesh.path,
    file: mshFile
  }
}

const computeSimulation = async (id, simulationPath, configuration) => {
  // Meshing
  await Promise.all(
    Object.keys(configuration).map(async (key) => {
      if (configuration[key].meshable) {
        const geometry = configuration[key]

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

  // Compute simulation
  const code = await Services.freefem(
    simulationPath,
    path.join('run', id + '.edp')
  )

  if (code !== 0) {
    throw new Error('Simulating process failed. Code ' + code)
  }
}

export default { computeMesh, computeSimulation }
