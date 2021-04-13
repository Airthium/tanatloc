import useSWR from 'swr'
import Caller from '@/api/call'

/**
 * Use system
 * @memberof module:api/system
 */
const useSystem = () => {
  const { data, error, mutate } = useSWR('/api/system', Caller.fetcher)
  const loading = !data
  const system = data && data.system
  return [
    system,
    { mutateSystem: mutate, errorSystem: error, loadingSystem: loading }
  ]
}

export default useSystem
