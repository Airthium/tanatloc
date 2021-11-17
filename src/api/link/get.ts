import { ILink } from '@/database/index.d'

import { call } from '@/api/call'

/**
 * Get
 * @memberof API.Link
 * @param {string} id Id
 * @param {Array} data Data
 * @returns {Object} Link `{ id, ...data }`
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
