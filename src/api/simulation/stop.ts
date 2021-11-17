import { call } from '@/api/call'

/**
 * Stop
 * @memberof API.Simulation
 * @param {Object} simulation Simulation `{ id }`
 * @returns {Object} `{ ok: true }`
 */
export const stop = async (simulation: { id: string }): Promise<void> => {
  await call('/api/simulation/' + simulation.id + '/stop', {
    method: 'GET'
  })
}
