/** @module lib/geometry */

import path from 'path'

import storage from '@/config/storage'

import GeometryDB from '@/database/geometry'

import Project from '../project'
import Tools from '../tools'
import { readFile } from 'fs'

/**
 * Add geometry
 * @param {Object} param Param { project: { id }, geometry: { name, uid, buffer } }
 */
const add = async ({ project, geometry }) => {
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

    // Add geometry reference in project
    await Project.update(project, [
      {
        type: 'array',
        method: 'append',
        key: 'geometries',
        value: geometryData.id
      }
    ])

    // Convert
    const part = await Tools.convert(storage.GEOMETRY, {
      name: geometryData.uploadfilename,
      target: geometry.uid
    })

    // Get summary
    const summary = await Tools.readFile(
      path.join(storage.GEOMETRY, geometry.uid, 'part.json')
    )
    // Update geometry
    geometryData.json = part.json
    geometryData.glb = part.glb
    geometryData.summary = summary.toString()
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
        value: summary.toString()
      }
    ])

    // Return
    return geometryData
  } catch (err) {
    console.warn(err)
    console.warn('-> Delete geometry')
    await del(geometryData)

    throw err
  }
}

/**
 * Get geometry
 * @param {string} id Geometry's id
 * @param {Array} data Data
 * @returns
 */
const get = async (id, data) => {
  return GeometryDB.get(id, data)
}

/**
 * Delete geometry
 * @param {Object} geometry Geometry { id }
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
  try {
    await Tools.removeFile(
      path.join(
        storage.GEOMETRY,
        geometryData.uploadfilename + '.' + geometryData.extension
      )
    )
  } catch (err) {
    console.warn(err)
  }

  // Delete glb file
  try {
    await Tools.removeFile(path.join(storage.GEOMETRY, geometryData.glb))
  } catch (err) {
    console.warn(err)
  }

  // Delete json directory
  try {
    await Tools.removeDirectory(path.join(storage.GEOMETRY, geometryData.json))
  } catch (err) {
    console.warn(err)
  }

  // Delete geometry
  await GeometryDB.del(geometry)
}

export default { add, get, del }
