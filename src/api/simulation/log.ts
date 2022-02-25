/** @module API.Simulation.Log */

import { call } from '@/api/call'

/**
 * Log
 * @param simulation Simulation
 * @param file File
 * @returns Log
 */
export const log = async (
  simulation: { id: string },
  file: string
): Promise<{ log: Buffer }> => {
  const response = await call('/api/simulation/' + simulation.id + '/log', {
    method: 'POST',
    body: JSON.stringify({ file })
  })

  return response.json()
}
