/** @module src/lib/mesh */

import path from 'path'
import { exec } from 'child_process'

import storage from '../../config/storage'
import { render } from './template'

/**
 * Build mesh
 */
const build = async (simulation, geometry, configuration) => {
  const globalPath = path.join(storage.SIMULATION, simulation.id)
  const meshPath = path.join(globalPath, 'mesh')

  const geometryName = geometry.file.name
  const geometryOriginPath = geometry.file.originPath

  // Render template
  const geoName = geometryName + '.geo'
  const mshName = geometryName + '.msh'
  await render(
    './templates/gmsh3D.geo.ejs',
    {
      ...configuration,
      geometry: path.join(globalPath, geometryOriginPath, geometryName)
    },
    {
      location: meshPath,
      name: geoName
    }
  )

  await new Promise((resolve, reject) => {
    exec(
      'docker run --rm -v ' +
        globalPath +
        ':' +
        globalPath +
        ' -u $(id -u):$(id -g) tanatloc/converters:latest gmsh ' +
        ' -3 ' +
        path.join(meshPath, geoName) +
        ' -o ' +
        path.join(meshPath, mshName) +
        ' -format msh2',
      (error, stdout, stderr) => {
        if (error) reject({ error, stdout, stderr })
        resolve(stdout)
      }
    )
  })

  return path.join(meshPath, mshName)
}

export { build }
