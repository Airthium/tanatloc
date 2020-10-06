import useSWR from 'swr'
import { fetcher } from '../call'

/**
 * Use simulation
 * @memberof module:src/api/simulation
 * @param {string} id Simulation's id
 */
const useSimulation = (id) => {
  const { data, mutate } = useSWR(
    'api/simulation' + (id ? '/' + id : ''),
    fetcher
  )
  const loading = !data
  const simulation = (data && data.simulation) || {}
  return [simulation, { mutateSimulation: mutate, loadingSimulation: loading }]
}

export default useSimulation
