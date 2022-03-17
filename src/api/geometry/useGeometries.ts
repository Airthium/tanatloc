/** @module API.Geometry.UseGeometries */

import useSWR from 'swr'
import { useCallback } from 'react'

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
   * @param geometry Geometry
   */
  const addOne = useCallback(
    (geometry: IGeometry): void => {
      const newGeometries = [...geometries, geometry]
      mutate({ geometries: newGeometries })
    },
    [geometries]
  )

  /**
   * Delete one (useGeometries)
   * @param geometry Geometry
   */
  const delOne = useCallback(
    (geometry: IGeometry): void => {
      const filteredGeometries = geometries.filter((s) => s.id !== geometry.id)
      mutate({ geometries: filteredGeometries })
    },
    [geometries]
  )

  /**
   * Mutate one (useGeometries)
   * @param geometry Geometry
   */
  const mutateOne = useCallback(
    (geometry: IGeometry): void => {
      const mutatedGeometries = geometries.map((g) => {
        if (g.id === geometry.id) g = { ...g, ...geometry }
        return g
      })
      mutate({ geometries: mutatedGeometries })
    },
    [geometries]
  )

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
