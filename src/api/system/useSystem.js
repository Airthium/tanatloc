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

  const myMutate = (update) => {
    mutate({
      system: {
        ...system,
        ...update
      }
    })
  }

  return [
    system,
    { mutateSystem: myMutate, errorSystem: error, loadingSystem: loading }
  ]
}

export default useSystem
