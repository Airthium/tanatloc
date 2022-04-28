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

export type TGeometryGetName = 'name'[]
export type TGeometryGetOriginalfilename = 'originalfilename'[]
export type TGeometryGetExtension = 'extension'[]
export type TGeometryGetUploadfilename = 'uploadfilename'[]
export type TGeometryGetGlb = 'glb'[]
export type TGeometryGetJson = 'json'[]
export type TGeometryGetSummary = 'summary'[]
export type TGeometryGetDimension = 'dimension'[]
export type TGeometryGetProject = 'project'[]

export interface IGeometry<T = []> {
  id: string
  name: TGeometryGetName extends T ? string : never
  originalfilename: TGeometryGetOriginalfilename extends T ? string : never
  extension: TGeometryGetExtension extends T ? string : never
  uploadfilename: TGeometryGetUploadfilename extends T ? string : never
  glb: TGeometryGetGlb extends T ? string : never
  json: TGeometryGetJson extends T ? string : never
  summary: TGeometryGetSummary extends T
    ? {
        uuid: string
        solids?: {
          uuid: string
          name: string
          number: number
          color?: { r: number; g: number; b: number }
        }[]
        faces?: {
          uuid: string
          name: string
          number: number
          color?: { r: number; g: number; b: number }
        }[]
        edges?: {
          uuid: string
          name: string
          number: number
          color?: { r: number; g: number; b: number }
        }[]
      }
    : never
  dimension?: TGeometryGetDimension extends T ? number : never
  project: TGeometryGetProject extends T ? string : never
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
