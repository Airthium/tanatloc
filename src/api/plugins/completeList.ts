/** @module API.Plugins.CompleteList */

import { ClientPlugin } from '@/plugins/index.d'

import { call } from '@/api/call'

/**
 * List
 * @returns List
 */
export const completeList = async (): Promise<ClientPlugin[]> => {
  const response = await call('/api/plugins', {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    }
  })

  return response.json()
}
