import useSWR from 'swr'
import { fetcher } from '@/api/call'

/**
 * Use geometries
 * @memberof API.Geometry
 * @param {Array} ids Ids
 * @returns {Array} `[geometries, { mutateGeometries, addOneGeometry, delOneGeometry, mutateOneGeometry, errorGeometries, loadingGeometries }]`
 */
export const useGeometries = (ids: Array<string>): Array<any> => {
  const { data, error, mutate } = useSWR(
    ['/api/geometries', JSON.stringify({ ids })],
    fetcher
  )
  const loading = !data
  const geometries = data?.geometries || []

  /**
   * Add one (useGeometries)
   * @memberof API.Geometry
   * @param {Object} geometry Geometry
   */
  const addOne = (geometry) => {
    const newGeometries = [...geometries, geometry]
    mutate({ geometries: newGeometries })
  }

  /**
   * Delete one (useGeometries)
   * @param {Object} geometry Geometry { id }
   */
  const delOne = (geometry) => {
    const filteredGeometries = geometries.filter((s) => s.id !== geometry.id)
    mutate({ geometryies: filteredGeometries })
  }

  /**
   * Mutate one (useGeometries)
   * @param {Object} geometry Geometry
   */
  const mutateOne = (geometry) => {
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
