/** @module API.Simulation.UseSimulation */

import useSWR from 'swr'
import { useCallback } from 'react'

import { IFrontSimulation } from '@/api/index.d'
import { fetcher } from '@/api/call'

/**
 * Use simulation
 * @param id Simulation id
 * @returns Simulation
 */
export const useSimulation = (
  id?: string,
  refresh?: number
): [
  IFrontSimulation,
  {
    mutateSimulation: (simulation: Partial<IFrontSimulation>) => void
    errorSimulation: Error
    loadingSimulation: boolean
  }
] => {
  const defaultData = { id: '0' } as IFrontSimulation

  const { data, error, mutate } = useSWR(
    '/api/simulation' + (id ? '/' + id : ''),
    fetcher,
    { refreshInterval: refresh || 0 }
  )
  const loading = !data
  const simulation = data?.simulation || defaultData

  /**
   * Mutate
   * @param update Simulation
   */
  const localMutate = useCallback(
    (update: Partial<IFrontSimulation>): void => {
      mutate({
        simulation: {
          ...simulation,
          ...update
        }
      })
    },
    [simulation, mutate]
  )

  return [
    simulation,
    {
      mutateSimulation: localMutate,
      errorSimulation: error,
      loadingSimulation: loading
    }
  ]
}
