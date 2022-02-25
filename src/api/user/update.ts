/** @module API.User.Update */

import { IDataBaseEntry } from '@/database/index.d'

import { call } from '@/api/call'

/**
 * Update
 * @param data Data
 */
export const update = async (data: IDataBaseEntry[]): Promise<void> => {
  await call('/api/user', {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}
