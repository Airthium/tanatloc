/** @module API.Simulation.Tasks */

import { call } from '@/api/call'
import { IFrontSimulationTask } from '../index.d'

/**
 * Tasks
 * @param simulation Simulation
 * @returns Tasks
 */
export const tasks = async (simulation: {
  id: string
}): Promise<IFrontSimulationTask[]> => {
  const response = await call('/api/simulation/' + simulation.id + '/tasks', {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    }
  })

  return response.json()
}
