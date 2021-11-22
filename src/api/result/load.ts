import { call } from '@/api/call'

/**
 * Load
 * @memberof API.Result
 * @param simulation Simulation
 * @param result Result
 * @returns Result
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
