import { call } from '@/api/call'

/**
 * Run
 * @memberof API.Simulation
 * @param simulation Simulation
 */
export const run = async (simulation: { id: string }): Promise<void> => {
  await call('/api/simulation/' + simulation.id + '/run', {
    method: 'GET'
  })
}
