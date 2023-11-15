/** @module Lib.Geometry */

import path from 'path'
import extractJson from '@airthium/extract-json-from-string'
import { v4 as uuid } from 'uuid'

import { IDataBaseEntry } from '@/database/index.d'
import { TGeometrySummary } from '@/database/geometry/get'
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

    // Update geometry
    const newGeometry: Partial<INewGeometryWithData> = {
      ...geometryData,
      glb: part[0].glb,
      brep: part[0].brep!
    }
    await GeometryDB.update({ id: geometryData.id }, [
      {
        key: 'glb',
        value: newGeometry.glb
      },
      {
        key: 'brep',
        value: newGeometry.brep
      }
    ])

    // Read summary
    const content = await Tools.readFile(path.join(GEOMETRY, part[0].glb))
    let fileContent = content.toString()
    const pos = fileContent.indexOf('JSON{')
    if (pos !== -1) fileContent = fileContent.substring(pos + 4)
    const jsons = extractJson(fileContent)
    const summary = jsons[0].scenes[0].extras as TGeometrySummary

    // Update geometry
    newGeometry.summary = summary
    await GeometryDB.update({ id: geometryData.id }, [
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
    return newGeometry as INewGeometryWithData
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
const del = async (geometry: {
  id: string
  glb?: string
  brep?: string
}): Promise<void> => {
  // Data
  const geometryData = await get(geometry.id, [
    'uploadfilename',
    'glb',
    'brep',
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

  // Delete brep file
  if (geometryData.brep)
    try {
      await Tools.removeFile(path.join(GEOMETRY, geometryData.brep))
    } catch (err) {
      console.warn(err)
    }
  if (geometry.brep)
    try {
      await Tools.removeFile(path.join(GEOMETRY, geometry.brep))
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
  const data = await get(geometry.id, ['uploadfilename', 'glb', 'brep'])

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

  // BRep
  if (data.brep) {
    //copy
    await Tools.copyFile(
      {
        path: GEOMETRY,
        file: data.brep
      },
      { path: to, file: data.brep }
    )
    //remove
    await Tools.removeFile(path.join(GEOMETRY, data.brep))
  }
}

/**
 * Split step
 * @param project Project
 * @param geometry Geometry
 * @returns Message
 */
const splitStep = async (
  project: { id: string },
  geometry: { id: string }
): Promise<string> => {
  // Data
  const geometryData = await get(geometry.id, ['extension', 'uploadfilename'])

  // Split step
  const geometries = await Tools.splitStep(
    GEOMETRY,
    geometryData.uploadfilename
  )

  if (geometries.length === 1) return 'Only one volume found'

  // Add geometries
  for (const geometry of geometries) {
    const buffer = await Tools.readFile(path.join(GEOMETRY, geometry))
    await add(project, { name: geometry, uid: uuid(), buffer })
  }

  return ''
}

const Geometry = { add, get, update, del, read, readPart, archive, splitStep }
export default Geometry
