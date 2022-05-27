/** @module Lib.Geometry */

import path from 'path'

import { IDataBaseEntry } from '@/database/index.d'
import { IGeometryPart, IGeometryFile, INewGeometryWithData } from '../index.d'

import { GEOMETRY } from '@/config/storage'

import GeometryDB, { IGeometry, TGeometryGet } from '@/database/geometry'

import Project from '../project'
import Tools from '../tools'

/**
 * Add
 * @param project Project
 * @param geometry Geometry
 * @returns New geometry
 */
const add = async (
  project: { id: string },
  geometry: { name: string; uid: string; buffer: Buffer }
): Promise<INewGeometryWithData> => {
  // Add geometry
  const geometryData = await GeometryDB.add(project, {
    name: geometry.name,
    uid: geometry.uid
  })

  try {
    // Write file
    await Tools.writeFile(
      GEOMETRY,
      geometryData.uploadfilename,
      Buffer.from(geometry.buffer)
    )

    // Convert
    const part = await Tools.convert(GEOMETRY, {
      name: geometryData.uploadfilename,
      target: geometry.uid
    })

    // Read summary
    const summary = await Tools.readJSONFile(
      path.join(GEOMETRY, part[0].glb + '.desc')
    )

    // Update geometry
    const newGeometry = {
      ...geometryData,
      glb: part[0].glb
    }
    await GeometryDB.update({ id: geometryData.id }, [
      {
        key: 'glb',
        value: newGeometry.glb
      },
      {
        key: 'summary',
        value: summary
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
    return newGeometry
  } catch (err) {
    console.warn(err)
    console.warn('-> Delete geometry')
    await del({
      ...geometryData,
      glb: geometry.uid + '.glb'
    })

    throw err
  }
}

/**
 * Get
 * @param id Id
 * @param data Data
 * @returns Geometry
 */
const get = async <T extends TGeometryGet>(
  id: string,
  data: T
): Promise<IGeometry<T>> => GeometryDB.get(id, data)

/**
 * Update geometry
 * @param geometry Geometry
 * @param data Data
 */
const update = async (
  geometry: { id: string },
  data: IDataBaseEntry[]
): Promise<void> => {
  await GeometryDB.update(geometry, data)
}

/**
 * Delete
 * @param geometry Geometry
 */
const del = async (geometry: { id: string; glb?: string }): Promise<void> => {
  // Data
  const geometryData = await get(geometry.id, [
    'uploadfilename',
    'glb',
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
      await Tools.removeFile(path.join(GEOMETRY, geometryData.uploadfilename))
    } catch (err) {
      console.warn(err)
    }

  // Delete glb file
  if (geometryData.glb)
    try {
      await Tools.removeFile(path.join(GEOMETRY, geometryData.glb))
    } catch (err) {
      console.warn(err)
    }
  if (geometry.glb)
    try {
      await Tools.removeFile(path.join(GEOMETRY, geometry.glb))
    } catch (err) {
      console.warn(err)
    }

  // Delete geometry
  await GeometryDB.del(geometry)
}

/**
 * Read
 * @param geometry Geometry
 * @returns Geometry file
 */
const read = async (geometry: { id: string }): Promise<IGeometryFile> => {
  // Data
  const geometryData = await get(geometry.id, ['extension', 'uploadfilename'])
  if (!geometryData) throw new Error('Geometry does not exist.')

  // Read
  const buffer = await Tools.readFile(
    path.join(GEOMETRY, geometryData.uploadfilename)
  )

  return {
    extension: geometryData.extension,
    buffer: Buffer.from(buffer)
  }
}

/**
 * Read part
 * @param geometry Geometry
 * @returns Geometry part
 */
const readPart = async (geometry: { id: string }): Promise<IGeometryPart> => {
  // Data
  const geometryData = await get(geometry.id, ['glb', 'summary'])
  if (!geometryData) throw new Error('Geometry does not exist.')

  // Read GLB
  const buffer = await Tools.readFile(path.join(GEOMETRY, geometryData.glb))

  return {
    summary: geometryData.summary,
    buffer: Buffer.from(buffer)
  }
}

/**
 * Archive geometry
 * @param geometry Geometry
 * @param to Target
 */
const archive = async (geometry: { id: string }, to: string): Promise<void> => {
  // Data
  const data = await get(geometry.id, ['uploadfilename', 'glb'])

  // Original file
  if (data.uploadfilename) {
    //copy
    await Tools.copyFile(
      {
        path: GEOMETRY,
        file: data.uploadfilename
      },
      {
        path: to,
        file: data.uploadfilename
      }
    )
    //remove
    await Tools.removeFile(path.join(GEOMETRY, data.uploadfilename))
  }

  // GLB
  if (data.glb) {
    //copy
    await Tools.copyFile(
      {
        path: GEOMETRY,
        file: data.glb
      },
      { path: to, file: data.glb }
    )
    //remove
    await Tools.removeFile(path.join(GEOMETRY, data.glb))
  }
}

const Geometry = { add, get, update, del, read, readPart, archive }
export default Geometry
