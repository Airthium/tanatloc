/** @module API.Simulation.UseSimulations */

import useSWR from 'swr'
import { useCallback } from 'react'

import { ISimulation } from '@/database/index.d'

import { fetcher } from '@/api/call'

/**
 * Use simulations
 * @param ids [Simulations ids]
 * @returns Simulations
 */
export const useSimulations = (
  ids?: string[]
): [
  ISimulation[],
  {
    mutateSimulations: (data: { simulations: ISimulation[] }) => void
    addOneSimulation: (simulation: ISimulation) => void
    delOneSimulation: (simulation: ISimulation) => void
    mutateOneSimulation: (simulation: ISimulation, revalidate?: boolean) => void
    errorSimulations: Error
    loadingSimulations: boolean
  }
] => {
  const defaultData = []

  const { data, error, mutate } = useSWR(
    ['/api/simulations', JSON.stringify({ ids })],
    fetcher
  )
  const loading = !data
  const simulations = data?.simulations || defaultData

  /**
   * Add one (useSimulations)
   * @param simulation Simulation
   */
  const addOne = useCallback(
    (simulation: ISimulation): void => {
      const newSimulations = [...simulations, simulation]
      mutate({ simulations: newSimulations })
    },
    [simulations, mutate]
  )

  /**
   * Delete one (useSimulations)
   * @param simulation Simulation
   */
  const delOne = useCallback(
    (simulation: ISimulation): void => {
      const filteredSimulations = simulations.filter(
        (s) => s.id !== simulation.id
      )
      mutate({ simulations: filteredSimulations })
    },
    [simulations, mutate]
  )

  /**
   * Mutate one (useSimulations)
   * @param simulation Simulation
   */
  const mutateOne = useCallback(
    (simulation: ISimulation, revalidate?: boolean): void => {
      const mutatedSimulations = simulations.map((s) => {
        if (s.id === simulation.id) s = { ...s, ...simulation }
        return s
      })
      mutate({ simulations: mutatedSimulations }, revalidate)
    },
    [simulations, mutate]
  )

  return [
    simulations,
    {
      mutateSimulations: mutate,
      addOneSimulation: addOne,
      delOneSimulation: delOne,
      mutateOneSimulation: mutateOne,
      errorSimulations: error,
      loadingSimulations: loading
    }
  ]
}
