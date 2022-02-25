/** @module API.Simulation.Del */

import { call } from '@/api/call'

/**
 * Delete
 * @param simulation Simulation
 */
export const del = async (simulation: { id: string }): Promise<void> => {
  await call('/api/simulation/' + simulation.id, {
    method: 'DELETE'
  })
}
