/** @module API.User.Check */

import { call } from '@/api/call'

/**
 * Check
 * @param user User
 * @returns User
 */
export const check = async (user: {
  email: string
  password: string
}): Promise<{ valid: boolean }> => {
  const response = await call('/api/user/check', {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    },
    body: JSON.stringify(user)
  })

  return response.json()
}
