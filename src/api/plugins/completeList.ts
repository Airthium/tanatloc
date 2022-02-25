/** @module API.Plugins.CompleteList */

import { IClientPlugin } from '@/database/index.d'

import { call } from '@/api/call'

/**
 * List
 * @returns List
 */
export const completeList = async (): Promise<IClientPlugin[]> => {
  const response = await call('/api/plugins', {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    }
  })

  return response.json()
}
