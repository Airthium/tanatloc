import useSWR from 'swr'
import { fetcher } from '@/api/call'

/**
 * Use simulations
 * @memberof API.Simulation
 * @param {Array} ids [Simulations ids]
 * @returns {Array} `[simulations, { mutateSimulations, addOneSimulation, delOneSimulation, mutateOneSimulation, errorSimulations, loadingSimulations }]`
 */
const useSimulations = (ids) => {
  const { data, error, mutate } = useSWR(
    ['/api/simulations', JSON.stringify({ ids })],
    fetcher
  )
  const loading = !data
  const simulations = data?.simulations || []

  /**
   * Add one (useSimulations)
   * @memberof API.Simulation
   * @param {Object} simulation Simulation
   */
  const addOne = (simulation) => {
    const newSimulations = [...simulations, simulation]
    mutate({ simulations: newSimulations })
  }

  /**
   * Delete one (useSimulations)
   * @memberof API.Simulation
   * @param {Object} simulation Simulation
   */
  const delOne = (simulation) => {
    const filteredSimulations = simulations.filter(
      (s) => s.id !== simulation.id
    )
    mutate({ simulations: filteredSimulations })
  }

  /**
   * Mutate one (useSimulations)
   * @memberof API.Simulation
   * @param {Object} simulation Simulation
   */
  const mutateOne = (simulation, revalidate) => {
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

export default useSimulations
