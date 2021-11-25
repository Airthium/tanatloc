/** @module Lib.Geometry */

import path from 'path'

import { GEOMETRY } from '@/config/storage'

import GeometryDB from '@/database/geometry'
import { IDataBaseEntry, IGeometry } from '@/database/index.d'

import { IGeometryPart, IGeometryFile, INewGeometryWithData } from '../index.d'

import Project from '../project'
import Tools from '../tools'

/**
 * Add
 * @memberof Lib.Geometry
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

    // Get summary
    const summary = await Tools.readJSONFile(
      path.join(GEOMETRY, geometry.uid, 'part.json')
    )

    summary.solids &&
      (await Promise.all(
        summary.solids.map(
          async (solid: {
            uuid: string
            path: string
            color: { r: number; g: number; b: number }
          }) => {
            const content = await Tools.readJSONFile(
              path.join(GEOMETRY, geometry.uid, solid.path)
            )
            solid.uuid = content.uuid
            if (content.data?.attributes.color?.itemSize === 3)
              solid.color = {
                r: content.data.attributes.color.array[0],
                g: content.data.attributes.color.array[1],
                b: content.data.attributes.color.array[2]
              }

            delete solid.path
          }
        )
      ))
    summary.faces &&
      (await Promise.all(
        summary.faces.map(
          async (face: {
            uuid: string
            path: string
            color: { r: number; g: number; b: number }
          }) => {
            const content = await Tools.readJSONFile(
              path.join(GEOMETRY, geometry.uid, face.path)
            )
            face.uuid = content.uuid
            if (content.data?.attributes.color?.itemSize === 3)
              face.color = {
                r: content.data.attributes.color.array[0],
                g: content.data.attributes.color.array[1],
                b: content.data.attributes.color.array[2]
              }

            delete face.path
          }
        )
      ))
    summary.edges &&
      (await Promise.all(
        summary.edges.map(
          async (edge: {
            uuid: string
            path: string
            color: { r: number; g: number; b: number }
          }) => {
            const content = await Tools.readJSONFile(
              path.join(GEOMETRY, geometry.uid, edge.path)
            )
            edge.uuid = content.uuid
            if (content.data?.attributes.color.itemSize === 3)
              edge.color = {
                r: content.data.attributes.color.array[0],
                g: content.data.attributes.color.array[1],
                b: content.data.attributes.color.array[2]
              }

            delete edge.path
          }
        )
      ))

    // Update geometry
    const newGeometry = {
      ...geometryData,
      json: part.json,
      glb: part.glb,
      summary
    }
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
    return newGeometry
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
 * Get
 * @memberof Lib.Geometry
 * @param id Id
 * @param data Data
 * @returns Geometry
 */
const get = async (id: string, data: Array<string>): Promise<IGeometry> => {
  return GeometryDB.get(id, data)
}

/**
 * Update geometry
 * @memberof Lib.Geometry
 * @param geometry Geometry
 * @param data Data
 */
const update = async (
  geometry: { id: string },
  data: IDataBaseEntry[]
): Promise<void> => {
  // Update
  await GeometryDB.update(geometry, data)
}

/**
 * Delete
 * @memberof Lib.Geometry
 * @param geometry Geometry
 */
const del = async (geometry: {
  id: string
  json?: string
  glb?: string
}): Promise<void> => {
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

  // Delete json directory
  if (geometryData.json)
    try {
      await Tools.removeDirectory(path.join(GEOMETRY, geometryData.json))
    } catch (err) {
      console.warn(err)
    }
  if (geometry.json)
    try {
      await Tools.removeDirectory(path.join(GEOMETRY, geometry.json))
    } catch (err) {
      console.warn(err)
    }

  // Delete geometry
  await GeometryDB.del(geometry)
}

/**
 * Read
 * @memberof Lib.Geometry
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
 * @memberof Lib.Geometry
 * @param geometry Geometry
 * @returns Geometry part
 */
const readPart = async (geometry: { id: string }): Promise<IGeometryPart> => {
  // Data
  const geometryData = await get(geometry.id, ['glb', 'json'])
  if (!geometryData) throw new Error('Geometry does not exist.')

  // Read GLB
  const buffer = await Tools.readFile(path.join(GEOMETRY, geometryData.glb))

  // Read part file
  const part = await Tools.readJSONFile(
    path.join(GEOMETRY, geometryData.json, 'part.json')
  )

  return {
    uuid: part.uuid,
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
  const data = await get(geometry.id, ['uploadfilename', 'glb, json'])

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

  // JSON
  if (data.json) {
    const json = path.join(GEOMETRY, data.json)
    //copy
    await Tools.copyDirectory(json, path.join(to, data.json))
    //remove
    await Tools.removeDirectory(json)
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
