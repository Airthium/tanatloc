/** @module lib/geometry */

import path from 'path'

import storage from '@/config/storage'

import GeometryDB from '@/database/geometry'

import Project from '../project'
import Tools from '../tools'

/**
 * Add geometry
 * @param {Object} project Project: { id }
 * @param {Object} geometry Geometry: { name, uid, buffer }
 */
const add = async (project, geometry) => {
  // Add geometry
  const geometryData = await GeometryDB.add(project, {
    name: geometry.name,
    uid: geometry.uid
  })

  try {
    // Write file
    await Tools.writeFile(
      storage.GEOMETRY,
      geometryData.uploadfilename,
      Buffer.from(geometry.buffer).toString()
    )

    // Convert
    const part = await Tools.convert(storage.GEOMETRY, {
      name: geometryData.uploadfilename,
      target: geometry.uid
    })

    // Get summary
    const summary = await Tools.readFile(
      path.join(storage.GEOMETRY, geometry.uid, 'part.json'),
      'json'
    )

    summary.solids &&
      (await Promise.all(
        summary.solids.map(async (solid) => {
          const content = await Tools.readFile(
            path.join(storage.GEOMETRY, geometry.uid, solid.path),
            'json'
          )
          solid.uuid = content.uuid
          if (content.data?.attributes.color?.itemSize === 3)
            solid.color = {
              r: content.data.attributes.color.array[0],
              g: content.data.attributes.color.array[1],
              b: content.data.attributes.color.array[2]
            }

          delete solid.path
        })
      ))
    summary.faces &&
      (await Promise.all(
        summary.faces.map(async (face) => {
          const content = await Tools.readFile(
            path.join(storage.GEOMETRY, geometry.uid, face.path),
            'json'
          )
          face.uuid = content.uuid
          if (content.data?.attributes.color?.itemSize === 3)
            face.color = {
              r: content.data.attributes.color.array[0],
              g: content.data.attributes.color.array[1],
              b: content.data.attributes.color.array[2]
            }

          delete face.path
        })
      ))
    summary.edges &&
      (await Promise.all(
        summary.edges.map(async (edge) => {
          const content = await Tools.readFile(
            path.join(storage.GEOMETRY, geometry.uid, edge.path),
            'json'
          )
          edge.uuid = content.uuid
          if (content.data?.attributes.color.itemSize === 3)
            edge.color = {
              r: content.data.attributes.color.array[0],
              g: content.data.attributes.color.array[1],
              b: content.data.attributes.color.array[2]
            }

          delete edge.path
        })
      ))

    // Update geometry
    geometryData.json = part.json
    geometryData.glb = part.glb
    geometryData.summary = summary
    await GeometryDB.update({ id: geometryData.id }, [
      {
        key: 'glb',
        value: part.glb
      },
      {
        key: 'json',
        value: part.json
      },
      {
        key: 'summary',
        value: JSON.stringify(summary)
      }
    ])

    // Add geometry reference in project
    await Project.update(project, [
      {
        type: 'array',
        method: 'append',
        key: 'geometries',
        value: geometryData.id
      }
    ])

    // Return
    return geometryData
  } catch (err) {
    console.warn(err)
    console.warn('-> Delete geometry')
    await del({
      ...geometryData,
      json: geometry.uid,
      glb: geometry.uid + '.glb'
    })

    throw err
  }
}

/**
 * Get geometry
 * @param {string} id Geometry's id
 * @param {Array} data Data
 */
const get = async (id, data) => {
  return GeometryDB.get(id, data)
}

/**
 * Update geometry
 * @param {Object} geometry Geometry { id }
 * @param {Object} data Data [{ key, value, ... }, ...]
 */
const update = async (geometry, data) => {
  // Update
  await GeometryDB.update(geometry, data)
}

/**
 * Delete geometry
 * @param {Object} geometry Geometry { id, ?json, ?glb }
 */
const del = async (geometry) => {
  // Data
  const geometryData = await get(geometry.id, [
    'extension',
    'uploadfilename',
    'glb',
    'json',
    'project'
  ])

  // Delete geometry reference in project
  await Project.update({ id: geometryData.project }, [
    {
      type: 'array',
      method: 'remove',
      key: 'geometries',
      value: geometry.id
    }
  ])

  // Delete original file
  if (geometryData.uploadfilename)
    try {
      await Tools.removeFile(
        path.join(storage.GEOMETRY, geometryData.uploadfilename)
      )
    } catch (err) {
      console.warn(err)
    }

  // Delete glb file
  if (geometryData.glb)
    try {
      await Tools.removeFile(path.join(storage.GEOMETRY, geometryData.glb))
    } catch (err) {
      console.warn(err)
    }
  if (geometry.glb)
    try {
      await Tools.removeFile(path.join(storage.GEOMETRY, geometry.glb))
    } catch (err) {
      console.warn(err)
    }

  // Delete json directory
  if (geometryData.json)
    try {
      await Tools.removeDirectory(
        path.join(storage.GEOMETRY, geometryData.json)
      )
    } catch (err) {
      console.warn(err)
    }
  if (geometry.json)
    try {
      await Tools.removeDirectory(path.join(storage.GEOMETRY, geometry.json))
    } catch (err) {
      console.warn(err)
    }

  // Delete geometry
  await GeometryDB.del(geometry)
}

/**
 * Read
 * @param {Object} geometry Geometry {id }
 */
const read = async (geometry) => {
  // Data
  const geometryData = await get(geometry.id, ['extension', 'uploadfilename'])
  if (!geometryData) throw new Error('Geometry does not exist.')

  // Read
  const buffer = await Tools.readFile(
    path.join(storage.GEOMETRY, geometryData.uploadfilename)
  )

  return {
    buffer: Buffer.from(buffer),
    extension: geometryData.extension
  }
}

/**
 * Read part
 * @param {Object} geometry Geometry { id }
 */
const readPart = async (geometry) => {
  // Data
  const geometryData = await get(geometry.id, ['glb', 'json'])
  if (!geometryData) throw new Error('Geometry does not exist.')

  // Read GLB
  const buffer = await Tools.readFile(
    path.join(storage.GEOMETRY, geometryData.glb)
  )

  // Read part file
  const part = await Tools.readFile(
    path.join(storage.GEOMETRY, geometryData.json, 'part.json'),
    'json'
  )

  return {
    uuid: part.uuid,
    buffer: Buffer.from(buffer)
  }
}

const Geometry = { add, get, update, del, read, readPart }
export default Geometry
