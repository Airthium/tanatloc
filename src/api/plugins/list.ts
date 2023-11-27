/** @module API.Plugins.List */

import { ClientPlugin } from '@/plugins/index.d'

import { call } from '@/api/call'

/**
 * List
 * @returns List
 */
export const list = async (): Promise<ClientPlugin[]> => {
  const response = await call('/api/plugins', {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    }
  })

  return response.json()
}
