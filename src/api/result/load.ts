/** @module API.Result.Load */

import { IGeometryPart } from '@/lib/index.d'

import { call } from '@/api/call'

/**
 * Load
 * @param simulation Simulation
 * @param result Result
 * @returns Result
 */
export const load = async (
  simulation: { id: string },
  result: { originPath: string; glb: string }
): Promise<IGeometryPart> => {
  const response = await call('/api/result', {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    },
    body: JSON.stringify({ simulation, result })
  })

  return response.json()
}
