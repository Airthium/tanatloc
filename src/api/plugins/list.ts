/** @module API.Plugins.List */

import { IClientPlugin } from '@/database/index.d'

import { call } from '@/api/call'

/**
 * List
 * @returns List
 */
export const list = async (): Promise<IClientPlugin[]> => {
  const response = await call('/api/plugins', {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    }
  })

  return response.json()
}
