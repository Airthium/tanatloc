/** @module src/lib/mesh */

import path from 'path'

import Template from './template'
import Services from '../services'

/**
 * Build mesh
 */
const build = async (globalPath, geometry, mesh) => {
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
      location: path.join(globalPath, mesh.path),
      name: geoFile
    }
  )

  const log = await Services.gmsh(
    globalPath,
    path.join(mesh.path, geoFile),
    path.join(mesh.path, mshFile)
  )
  // new Promise((resolve, reject) => {
  //   exec(
  //     'docker run --rm -v ' +
  //       globalPath +
  //       ':' +
  //       '/mesh' +
  //       ' -w /mesh' +
  //       ' -u $(id -u):$(id -g) tanatloc/converters:latest gmsh ' +
  //       ' -3 ' +
  //       path.join(mesh.path, geoFile) +
  //       ' -o ' +
  //       path.join(mesh.path, mshFile) +
  //       ' -format msh2',
  //     (error, stdout, stderr) => {
  //       if (error) reject({ error, stdout, stderr })
  //       resolve(stdout + '\n' + stderr)
  //     }
  //   )
  // })

  return {
    path: mesh.path,
    file: mshFile,
    log
  }
}

export default { build }
