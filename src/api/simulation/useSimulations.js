import useSWR from 'swr'
import { fetcher } from '../call'

/**
 * Use simulations
 * @memberof module:src/api/simulation
 * @param {Array} ids [Simulation's ids]
 */
const useSimulations = (ids) => {
  const { data, mutate } = useSWR(
    '/api/simulations/' + ids && ids.join('&'),
    fetcher
  )
  const loading = !data
  const simulations = (data && data.simulations) || []

  /**
   * Add one (useSimulations)
   * @memberof module:src/api/simulation
   * @param {Object} simulation Simulation
   */
  const addOne = (simulation) => {
    const newSimulations = [...simulations, simulation]
    mutate({ simulations: newSimulations })
  }

  /**
   * Delete one (useSimulations)
   * @memberof module:src/api/simulation
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
   * @memberof module:src/api/simulation
   * @param {Object} simulation Simulation
   */
  const mutateOne = (simulation) => {
    const mutatedSimulations = simulations.map((s) => {
      if (s.id === simulation.id) s = { ...s, ...simulation }
      return s
    })
    mutate({ simulations: mutatedSimulations })
  }

  return [
    simulations,
    {
      mutatedSimulations: mutate,
      addOneSimulation: addOne,
      delOneSimulation: delOne,
      mutateOneSimulation: mutateOne,
      loadingSimulations: loading
    }
  ]
}

export default useSimulations
