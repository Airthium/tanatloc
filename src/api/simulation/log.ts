import { call } from '@/api/call'

/**
 * Log
 * @memberof API.Simulation
 * @param {Object} simulation Simulation `{ id }`
 * @param {string} file File
 * @returns {string} Log
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
