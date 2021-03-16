import useSWR from 'swr'
import Caller from '@/api/call'

/**
 * Use system
 * @memberof module:api/system
 */
const useSystem = () => {
  const { data, mutate } = useSWR('/api/system', Caller.fetcher)
  const loading = !data
  const system = data && data.system
  return [system, { mutateSystem: mutate, loadingSystem: loading }]
}

export default useSystem
