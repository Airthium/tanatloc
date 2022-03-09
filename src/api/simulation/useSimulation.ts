/** @module API.Simulation.UseSimulation */

import useSWR from 'swr'
import { useCallback } from 'react'

import { ISimulation } from '@/database/index.d'

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

  /**
   * Mutate
   * @param update Simulation
   */
  const localMutate = useCallback((update: ISimulation): void => {
    mutate({
      simulation: {
        ...simulation,
        ...update
      }
    })
  }, [])

  return [
    simulation,
    {
      mutateSimulation: localMutate,
      errorSimulation: error,
      loadingSimulation: loading
    }
  ]
}
