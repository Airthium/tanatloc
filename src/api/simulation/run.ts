/** @module API.Simulation.Run */

import { call } from '@/api/call'

/**
 * Run
 * @param simulation Simulation
 * @param keepMesh Keep mesh
 */
export const run = async (
  simulation: { id: string },
  keepMesh?: boolean
): Promise<void> => {
  await call('/api/simulation/' + simulation.id + '/run', {
    method: 'PUT',
    body: JSON.stringify({ keepMesh })
  })
}
