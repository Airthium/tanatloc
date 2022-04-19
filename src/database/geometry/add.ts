/** @module Database.Geometry.Add */

import { tables } from '@/config/db'

import { query } from '..'

export interface INewGeometry {
  id: string
  name: string
  originalfilename: string
  extension: string
  uploadfilename: string
}

/**
 * Add
 * @param project Project
 * @param geometry Geometry
 * @returns Geometry
 */
export const add = async (
  project: { id: string },
  geometry: { name: string; uid: string }
): Promise<INewGeometry> => {
  const extension = geometry.name.split('.').pop() || ''
  const uploadFileName = geometry.uid + '.' + extension

  const response = await query(
    'INSERT INTO ' +
      tables.GEOMETRIES +
      ' (name, originalfilename, extension, uploadfilename, project) VALUES ($1, $1, $2, $3, $4) RETURNING id',
    [geometry.name, extension, uploadFileName, project.id]
  )

  const newGeometry = response.rows[0]
  newGeometry && (newGeometry.name = geometry.name)
  newGeometry && (newGeometry.originalfilename = geometry.name)
  newGeometry && (newGeometry.extension = extension)
  newGeometry && (newGeometry.uploadfilename = uploadFileName)

  return newGeometry
}
