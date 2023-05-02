/** @module API.Simulation.Copy */

import { IFrontNewSimulation } from '../index.d'

import { call } from '@/api/call'

/**
 * Copy
 * @param simulation Simulation
 */
export const copy = async (simulation: {
  id: string
}): Promise<IFrontNewSimulation> => {
  const response = await call('/api/simulation/' + simulation.id + '/copy', {
    method: 'GET'
  })

  return response.json()
}
