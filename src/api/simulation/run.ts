/** @module API.Simulation.Run */

import { call } from '@/api/call'

/**
 * Run
 * @param simulation Simulation
 */
export const run = async (simulation: { id: string }): Promise<void> => {
  await call('/api/simulation/' + simulation.id + '/run', {
    method: 'GET'
  })
}
