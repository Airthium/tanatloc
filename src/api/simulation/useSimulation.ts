import useSWR from 'swr'
import { fetcher } from '@/api/call'
import { ISimulation } from '@/database/index.d'

/**
 * Use simulation
 * @memberof API.Simulation
 * @param {string} id Simulation id
 * @returns {Array} `[simulation, { mutateSimulation, errorSimulation, loadingSimulation }]`
 */
export const useSimulation = (
  id: string,
  refresh?: number
): [
  ISimulation,
  {
    mutateSimulation: (simulation: ISimulation) => void
    errorSimulation: Error
    loadingSimulation: boolean
  }
] => {
  const { data, error, mutate } = useSWR(
    '/api/simulation' + (id ? '/' + id : ''),
    fetcher,
    { refreshInterval: refresh || 0 }
  )
  const loading = !data
  const simulation = data?.simulation || { id: '0' }

  const myMutate = (update: ISimulation) => {
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
