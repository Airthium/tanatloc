import useSWR from 'swr'
import Caller from '@/api/call'

const useGeometries = (ids) => {
  const { data, mutate } = useSWR(
    ['/api/geometries', JSON.stringify({ ids })],
    Caller.fetcher
  )
  const loading = !data
  const geometries = (data && data.geometries) || []

  return [geometries]
}

export default useGeometries
