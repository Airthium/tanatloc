/** @module API.Geometry.UseGeometries */

import useSWR from 'swr'
import { useCallback } from 'react'

import { IFrontGeometries, IFrontGeometriesItem } from '@/api/index.d'
import { fetcher } from '@/api/call'

// TODO new geometry ?

/**
 * Use geometries
 * @param ids Ids
 * @returns Geometries
 */
export const useGeometries = (
  ids?: Array<string>
): [
  IFrontGeometries,
  {
    addOneGeometry: (geometry: Partial<IFrontGeometriesItem>) => void
    delOneGeometry: (geometry: Partial<IFrontGeometriesItem>) => void
    mutateOneGeometry: (geometry: Partial<IFrontGeometriesItem>) => void
    errorGeometries: Error
    loadingGeometries: boolean
  }
] => {
  const defaultData: IFrontGeometries = []

  const { data, error, mutate } = useSWR(
    ['/api/geometries', JSON.stringify({ ids })],
    fetcher
  )
  const loading = !data
  const geometries = data?.geometries || defaultData

  /**
   * Add one (useGeometries)
   * @param geometry Geometry
   */
  const addOne = useCallback(
    (geometry: Partial<IFrontGeometriesItem>): void => {
      const newGeometries = [...geometries, geometry] as IFrontGeometries
      mutate({ geometries: newGeometries })
    },
    [geometries, mutate]
  )

  /**
   * Delete one (useGeometries)
   * @param geometry Geometry
   */
  const delOne = useCallback(
    (geometry: Partial<IFrontGeometriesItem>): void => {
      const filteredGeometries = geometries.filter((s) => s.id !== geometry.id)
      mutate({ geometries: filteredGeometries })
    },
    [geometries, mutate]
  )

  /**
   * Mutate one (useGeometries)
   * @param geometry Geometry
   */
  const mutateOne = useCallback(
    (geometry: Partial<IFrontGeometriesItem>): void => {
      const mutatedGeometries = geometries.map((g) => {
        if (g.id === geometry.id) g = { ...g, ...geometry }
        return g
      })
      mutate({ geometries: mutatedGeometries })
    },
    [geometries, mutate]
  )

  return [
    geometries,
    {
      addOneGeometry: addOne,
      delOneGeometry: delOne,
      mutateOneGeometry: mutateOne,
      errorGeometries: error,
      loadingGeometries: loading
    }
  ]
}
