import { tables } from '@/config/db'

import { getter } from '..'

type Geometry = {
  id: string
  name?: string
  originalfilename?: string
  extension?: string
  uploadfilename?: string
  glb?: string
  json?: string
  summary?: object
  project?: string
}

/**
 * Get
 * @memberof Database.Geometry
 * @param {string} id Id
 * @param {Array} data Data
 */
export const get = async (
  id: string,
  data: Array<string>
): Promise<Geometry> => {
  const response = await getter(tables.GEOMETRIES, id, data)

  const geometry = response.rows[0]
  geometry && (geometry.id = id)

  return geometry
}
