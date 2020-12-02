import useSWR from 'swr'
import Caller from '../call'

/**
 * Use simulation
 * @memberof module:src/api/simulation
 * @param {string} id Simulation's id
 */
const useSimulation = (id, refresh) => {
  const { data, mutate } = useSWR(
    'api/simulation' + (id ? '/' + id : ''),
    Caller.fetcher,
    { refreshInterval: refresh || 0 }
  )
  const loading = !data
  const simulation = (data && data.simulation) || {}
  return [simulation, { mutateSimulation: mutate, loadingSimulation: loading }]
}

export default useSimulation
