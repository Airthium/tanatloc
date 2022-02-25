/** @module API.User.DelById */

import { call } from '@/api/call'

/**
 * Delete by id
 * @param id User id
 */
export const delById = async (id: string): Promise<void> => {
  await call('/api/user/' + id, {
    method: 'DELETE'
  })
}
