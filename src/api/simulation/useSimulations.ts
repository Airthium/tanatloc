/** @module API.Simulation.UseSimulations */

import useSWR from 'swr'
import { useCallback } from 'react'

import {
  IFrontMutateSimulationsItem,
  IFrontNewSimulation,
  IFrontSimulations
} from '@/api/index.d'
import { fetcher } from '@/api/call'

/**
 * Use simulations
 * @param ids [Simulations ids]
 * @returns Simulations
 */
export const useSimulations = (
  ids?: string[]
): [
  IFrontSimulations,
  {
    addOneSimulation: (simulation: IFrontNewSimulation) => void
    delOneSimulation: (simulation: IFrontMutateSimulationsItem) => void
    mutateOneSimulation: (
      simulation: IFrontMutateSimulationsItem,
      revalidate?: boolean
    ) => void
    errorSimulations: Error
    loadingSimulations: boolean
  }
] => {
  const defaultData: IFrontSimulations = []

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
    (simulation: IFrontNewSimulation): void => {
      const newSimulations = [...simulations, simulation] as IFrontSimulations
      mutate({ simulations: newSimulations })
    },
    [simulations, mutate]
  )

  /**
   * Delete one (useSimulations)
   * @param simulation Simulation
   */
  const delOne = useCallback(
    (simulation: IFrontMutateSimulationsItem): void => {
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
    (simulation: IFrontMutateSimulationsItem, revalidate?: boolean): void => {
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
      addOneSimulation: addOne,
      delOneSimulation: delOne,
      mutateOneSimulation: mutateOne,
      errorSimulations: error,
      loadingSimulations: loading
    }
  ]
}
