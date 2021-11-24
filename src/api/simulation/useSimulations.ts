import useSWR from 'swr'
import { fetcher } from '@/api/call'
import { ISimulation } from '@/database/index.d'

/**
 * Use simulations
 * @memberof API.Simulation
 * @param ids [Simulations ids]
 * @returns Simulations
 */
export const useSimulations = (
  ids: string[]
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
  const { data, error, mutate } = useSWR(
    ['/api/simulations', JSON.stringify({ ids })],
    fetcher
  )
  const loading = !data
  const simulations = data?.simulations || []

  /**
   * Add one (useSimulations)
   * @memberof API.Simulation
   * @param simulation Simulation
   */
  const addOne = (simulation: ISimulation) => {
    const newSimulations = [...simulations, simulation]
    mutate({ simulations: newSimulations })
  }

  /**
   * Delete one (useSimulations)
   * @memberof API.Simulation
   * @param simulation Simulation
   */
  const delOne = (simulation: ISimulation) => {
    const filteredSimulations = simulations.filter(
      (s) => s.id !== simulation.id
    )
    mutate({ simulations: filteredSimulations })
  }

  /**
   * Mutate one (useSimulations)
   * @memberof API.Simulation
   * @param simulation Simulation
   */
  const mutateOne = (simulation: ISimulation, revalidate?: boolean) => {
    const mutatedSimulations = simulations.map((s) => {
      if (s.id === simulation.id) s = { ...s, ...simulation }
      return s
    })
    mutate({ simulations: mutatedSimulations }, revalidate)
  }

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
