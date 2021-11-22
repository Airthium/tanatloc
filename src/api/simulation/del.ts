import { call } from '@/api/call'

/**
 * Delete
 * @memberof API.Simulation
 * @param simulation Simulation
 */
export const del = async (simulation: { id: string }): Promise<void> => {
  await call('/api/simulation/' + simulation.id, {
    method: 'DELETE'
  })
}
