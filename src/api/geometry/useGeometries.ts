/** @module API.Geometry.UseGeometries */

import useSWR from 'swr'
import { useCallback } from 'react'

import {
  IFrontNewGeometry,
  IFrontGeometries,
  IFrontMutateGeometriesItem
} from '@/api/index.d'
import { fetcher } from '@/api/call'

/**
 * Use geometries
 * @param ids Ids
 * @returns Geometries
 */
export const useGeometries = (
  ids?: string[]
): [
  IFrontGeometries,
  {
    addOneGeometry: (geometry: IFrontNewGeometry) => Promise<void>
    delOneGeometry: (geometry: IFrontMutateGeometriesItem) => Promise<void>
    mutateOneGeometry: (geometry: IFrontMutateGeometriesItem) => Promise<void>
    errorGeometries: Error
    loadingGeometries: boolean
  }
] => {
  const defaultData: IFrontGeometries = []

  const { data, error, mutate } = useSWR(
    ['/api/geometries', JSON.stringify({ ids })],
    ([url, payload]) => fetcher(url, payload)
  )
  const loading = !data
  const geometries = data?.geometries ?? defaultData

  /**
   * Add one (useGeometries)
   * @param geometry Geometry
   */
  const addOne = useCallback(
    async (geometry: IFrontNewGeometry): Promise<void> => {
      const newGeometries = [...geometries, geometry] as IFrontGeometries
      await mutate({ geometries: newGeometries })
    },
    [geometries, mutate]
  )

  /**
   * Delete one (useGeometries)
   * @param geometry Geometry
   */
  const delOne = useCallback(
    async (geometry: IFrontMutateGeometriesItem): Promise<void> => {
      const filteredGeometries = geometries.filter((s) => s.id !== geometry.id)
      await mutate({ geometries: filteredGeometries })
    },
    [geometries, mutate]
  )

  /**
   * Mutate one (useGeometries)
   * @param geometry Geometry
   */
  const mutateOne = useCallback(
    async (geometry: IFrontMutateGeometriesItem): Promise<void> => {
      const mutatedGeometries = geometries.map((g) => {
        if (g.id === geometry.id) g = { ...g, ...geometry }
        return g
      })
      await mutate({ geometries: mutatedGeometries })
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
