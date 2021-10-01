import useSWR from 'swr'
import Caller from '@/api/call'

/**
 * Use simulation
 * @memberof API.Simulation
 * @param {string} id Simulation's id
 * @returns {Array} [simulation, { mutateSimulation, errorSimulation, loadingSimulation }]
 */
const useSimulation = (id, refresh) => {
  const { data, error, mutate } = useSWR(
    '/api/simulation' + (id ? '/' + id : ''),
    Caller.fetcher,
    { refreshInterval: refresh || 0 }
  )
  const loading = !data
  const simulation = data?.simulation || {}

  const myMutate = (update) => {
    mutate({
      simulation: {
        ...simulation,
        ...update
      }
    })
  }

  return [
    simulation,
    {
      mutateSimulation: myMutate,
      errorSimulation: error,
      loadingSimulation: loading
    }
  ]
}

export default useSimulation
