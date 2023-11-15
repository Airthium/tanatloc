/** @module API.Geometry.SplitStep */

import { call } from '@/api/call'

/**
 * Split step
 * @param project Project
 * @param geometry Geometry
 * @returns Message
 */
export const splitStep = async (
  project: { id: string },
  geometry: { id: string }
): Promise<{ message: string }> => {
  const response = await call('/api/geometry/' + geometry.id + '/splitStep', {
    method: 'POST',
    body: JSON.stringify({ project })
  })

  return response.json()
}
