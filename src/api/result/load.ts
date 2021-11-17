import { call } from '@/api/call'

/**
 * Load
 * @memberof API.Result
 * @param {Object} simulation  Simulation `{ id }`
 * @param {Object} result Result `{ originPath, glb }`
 * @returns {Object} Result `{ buffer }`
 */
export const load = async (
  simulation: { id: string },
  result: { originPath: string; glb: string }
): Promise<{ buffer: Buffer }> => {
  const response = await call('/api/result', {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    },
    body: JSON.stringify({ simulation, result })
  })

  return response.json()
}
