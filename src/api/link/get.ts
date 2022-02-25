/** @module API.Link.Get */

import { ILink } from '@/database/index.d'

import { call } from '@/api/call'

/**
 * Get
 * @param id Id
 * @param data Data
 * @returns Link
 */
export const get = async (id: string, data: string[]): Promise<ILink> => {
  const response = await call('/api/link', {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    },
    body: JSON.stringify({ id, data })
  })

  return response.json()
}
