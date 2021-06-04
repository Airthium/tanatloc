import useSWR from 'swr'
import Caller from '@/api/call'

const useGeometries = (ids) => {
  const { data, error, mutate } = useSWR(
    ['/api/geometries', JSON.stringify({ ids })],
    Caller.fetcher
  )
  const loading = !data
  const geometries = (data && data.geometries) || []

  /**
   * Add one (useGeometries)
   * @memberof module:api/geometry
   * @param {Object} geometry Geometry
   */
  const addOne = (geometry) => {
    const newGeometries = [...geometries, geometry]
    mutate({ geometries: newGeometries })
  }

  const delOne = (geometry) => {
    const filteredGeometries = geometries.filter((s) => s.id !== geometry.id)
    mutate({ geometryies: filteredGeometries })
  }

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

export default useGeometries
