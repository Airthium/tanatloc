/** @module lib/geometry */

import path from 'path'

import storage from '@/config/storage'

import GeometryDB from '@/database/geometry'

import Project from '../project'
import Tools from '../tools'

/**
 * Add geometry
 * @param {Object} param Param { project: { id }, geometry: { name, uid } }
 */
const add = async ({ project, geometry }) => {
  // Add geometry
  const geometryData = await GeometryDB.add(project, geometry)

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
  const part = await Tools.convert(path.join(storage.GEOMETRY), {
    name: path.join(geometry.name),
    uid: path.join(geometry.uid)
  })

  // Update geomtry
  geometryData.json = part.json
  geometryData.glb = part.glb
  await GeometryDB.update({ id: geometryData.id }, [
    {
      key: 'glb',
      value: part.glb
    },
    {
      key: 'json',
      value: part.json
    }
  ])

  // Return
  return geometryData
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
      path.join(storage.GEOMETRY, geometryData.uploadfilename)
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
