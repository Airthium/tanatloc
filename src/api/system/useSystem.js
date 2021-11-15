import useSWR from 'swr'
import { fetcher } from '@/api/call'

/**
 * Use system
 * @memberof API.System
 * @returns {Array} `[system, {mutateSystem, errorSystem, loadingSystem }]`
 */
const useSystem = () => {
  const { data, error, mutate } = useSWR('/api/system', fetcher)
  const loading = !data
  const system = data?.system

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
