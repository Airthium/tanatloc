/** @module API.Simulation.Stop */

import { call } from '@/api/call'

/**
 * Stop
 * @param simulation Simulation
 */
export const stop = async (simulation: { id: string }): Promise<void> => {
  await call('/api/simulation/' + simulation.id + '/stop', {
    method: 'GET'
  })
}
