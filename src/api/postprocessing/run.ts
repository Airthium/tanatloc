/** @module API.Postprocessing */

import { call } from '@/api/call'

export const run = async (
  simulation: { id: string },
  result: { fileName: string; originPath: string },
  filter: string,
  ...parameters: string[]
): Promise<{ uuid: string; buffer: Buffer }> => {
  const response = await call('/api/postprocessing', {
    method: 'POST',
    body: JSON.stringify({ simulation, result, filter, parameters })
  })

  return response.json()
}
