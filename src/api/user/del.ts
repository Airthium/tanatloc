/** @module API.User.Del */

import { call } from '@/api/call'

/**
 * Delete
 */
export const del = async (): Promise<void> => {
  await call('/api/user', {
    method: 'DELETE'
  })
}
