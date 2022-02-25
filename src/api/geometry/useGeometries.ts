/** @module API.Geometry.UseGeometries */

import useSWR from 'swr'

import { IGeometry } from '@/database/index.d'

import { fetcher } from '@/api/call'

/**
 * Use geometries
 * @param ids Ids
 * @returns Geometries
 */
export const useGeometries = (
  ids?: Array<string>
): [
  IGeometry[],
  {
    mutateGeometries: (data: { geometries: IGeometry[] }) => void
    addOneGeometry: (geometry: IGeometry) => void
    delOneGeometry: (geometry: IGeometry) => void
    mutateOneGeometry: (geometry: IGeometry) => void
    errorGeometries: Error
    loadingGeometries: boolean
  }
] => {
  const { data, error, mutate } = useSWR(
    ['/api/geometries', JSON.stringify({ ids })],
    fetcher
  )
  const loading = !data
  const geometries = data?.geometries || []

  /**
   * Add one (useGeometries)
   * @memberof API.Geometry
   * @param geometry Geometry
   */
  const addOne = (geometry: IGeometry) => {
    const newGeometries = [...geometries, geometry]
    mutate({ geometries: newGeometries })
  }

  /**
   * Delete one (useGeometries)
   * @param geometry Geometry
   */
  const delOne = (geometry: IGeometry) => {
    const filteredGeometries = geometries.filter((s) => s.id !== geometry.id)
    mutate({ geometries: filteredGeometries })
  }

  /**
   * Mutate one (useGeometries)
   * @param geometry Geometry
   */
  const mutateOne = (geometry: IGeometry) => {
    const mutatedGeometries = geometries.map((g) => {
      if (g.id === geometry.id) g = { ...g, ...geometry }
      return g
    })
    mutate({ geometries: mutatedGeometries })
  }

  return [
    geometries,
    {
      mutateGeometries: mutate,
      addOneGeometry: addOne,
      delOneGeometry: delOne,
      mutateOneGeometry: mutateOne,
      errorGeometries: error,
      loadingGeometries: loading
    }
  ]
}
