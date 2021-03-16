import useSWR from 'swr'
import Caller from '@/api/call'

/**
 * Use simulations
 * @memberof module:api/simulation
 * @param {Array} ids [Simulation's ids]
 */
const useSimulations = (ids) => {
  const { data, mutate } = useSWR(
    '/api/simulations' + (ids && ids.length ? '/' + ids.join('&') : ''),
    Caller.fetcher
  )
  const loading = !data
  const simulations = (data && data.simulations) || []

  /**
   * Add one (useSimulations)
   * @memberof module:api/simulation
   * @param {Object} simulation Simulation
   */
  const addOne = (simulation) => {
    const newSimulations = [...simulations, simulation]
    mutate({ simulations: newSimulations })
  }

  /**
   * Delete one (useSimulations)
   * @memberof module:api/simulation
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
   * @memberof module:api/simulation
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
      loadingSimulations: loading
    }
  ]
}

export default useSimulations
