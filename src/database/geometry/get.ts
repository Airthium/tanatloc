/** @module Database.Geometry.Get */

import { tables } from '@/config/db'

import { getter } from '..'

export type TGeometryGet = (
  | 'name'
  | 'originalfilename'
  | 'extension'
  | 'uploadfilename'
  | 'glb'
  | 'json'
  | 'summary'
  | 'dimension'
  | 'project'
)[]

export interface IGeometry<T> {
  id: string
  name: T extends ['name'] ? string : never
  originalfilename: T extends ['originalfilename'] ? string : never
  extension: T extends ['extension'] ? string : never
  uploadfilename: T extends ['uploadfilename'] ? string : never
  glb: T extends ['glb'] ? string : never
  json: T extends ['json'] ? string : never
  summary: T extends ['summary']
    ? {
        uuid: string
        solids?: {
          uuid: string
          number: number | string
          color?: { r: number; g: number; b: number }
        }[]
        faces?: {
          uuid: string
          number: number | string
          color?: { r: number; g: number; b: number }
        }[]
        edges?: {
          uuid: string
          number: number | string
          color?: { r: number; g: number; b: number }
        }[]
      }
    : never
  dimension?: T extends ['dimension'] ? number : never
  project: T extends ['project'] ? string : never
}

/**
 * Get
 * @param id Id
 * @param data Data
 */
export const get = async <T extends TGeometryGet>(
  id: string,
  data: T
): Promise<IGeometry<T>> => {
  const response = await getter(tables.GEOMETRIES, id, data)

  const geometry = response.rows[0]
  geometry && (geometry.id = id)

  return geometry
}
