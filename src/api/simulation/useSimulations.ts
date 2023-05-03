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
    addOneSimulation: (simulation: IFrontNewSimulation) => Promise<void>
    delOneSimulation: (simulation: IFrontMutateSimulationsItem) => Promise<void>
    mutateOneSimulation: (
      simulation: IFrontMutateSimulationsItem,
      revalidate?: boolean
    ) => Promise<void>
    errorSimulations: Error
    loadingSimulations: boolean
  }
] => {
  const defaultData: IFrontSimulations = []

  const { data, error, mutate } = useSWR(
    ['/api/simulations', JSON.stringify({ ids })],
    ([url, payload]) => fetcher(url, payload)
  )
  const loading = !data
  const simulations = data?.simulations ?? defaultData

  /**
   * Add one (useSimulations)
   * @param simulation Simulation
   */
  const addOne = useCallback(
    async (simulation: IFrontNewSimulation): Promise<void> => {
      const newSimulations = [...simulations, simulation] as IFrontSimulations
      await mutate({ simulations: newSimulations })
    },
    [simulations, mutate]
  )

  /**
   * Delete one (useSimulations)
   * @param simulation Simulation
   */
  const delOne = useCallback(
    async (simulation: IFrontMutateSimulationsItem): Promise<void> => {
      const filteredSimulations = simulations.filter(
        (s) => s.id !== simulation.id
      )
      await mutate({ simulations: filteredSimulations })
    },
    [simulations, mutate]
  )

  /**
   * Mutate one (useSimulations)
   * @param simulation Simulation
   */
  const mutateOne = useCallback(
    async (
      simulation: IFrontMutateSimulationsItem,
      revalidate?: boolean
    ): Promise<void> => {
      const mutatedSimulations = simulations.map((s) => {
        if (s.id === simulation.id) s = { ...s, ...simulation }
        return s
      })
      await mutate({ simulations: mutatedSimulations }, revalidate)
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
