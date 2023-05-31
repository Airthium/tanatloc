/** @module API.UserModel.Del */

import { call } from '@/api/call'

/**
 * Delete
 * @param userModel User model
 */
export const del = async (userModel: { id: string }): Promise<void> => {
  await call('/api/userModel', {
    method: 'DELETE',
    body: JSON.stringify({ userModel })
  })
}
