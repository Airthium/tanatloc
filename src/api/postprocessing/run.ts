/** @module API.Postprocessing.Run */

import { call } from '@/api/call'

export const run = async (
  simulation: { id: string },
  result: { fileName: string; originPath: string },
  filter: string,
  parameters: string[]
): Promise<
  {
    fileName: string
    name: string
    originPath: string
    glb: string
    json: string
  }[]
> => {
  const response = await call('/api/postprocessing', {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    },
    body: JSON.stringify({ simulation, result, filter, parameters })
  })

  return response.json()
}
