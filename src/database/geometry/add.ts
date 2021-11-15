import { tables } from '@/config/db'

import { query } from '..'
import { INewGeometry } from '../index.d'

/**
 * Add
 * @memberof Database.Geometry
 * @param {Object} project Project `{ id }`
 * @param {Object} geometry Geometry `{ name, uid }`
 * @returns {Object} Geometry `{ id, name, originalfilename, extension, uploadfilename }`
 */
export const add = async (
  project: { id: string },
  geometry: { name: string; uid: string }
): Promise<INewGeometry> => {
  const extension = geometry.name.split('.').pop()
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
