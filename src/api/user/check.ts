import { IUserCheck } from '@/database/index.d'

import { call } from '@/api/call'

/**
 * Check
 * @memberof API.User
 * @param user User
 * @returns User
 */
export const check = async (user: {
  email: string
  password: string
}): Promise<IUserCheck> => {
  const response = await call('/api/user/check', {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    },
    body: JSON.stringify(user)
  })

  return response.json()
}
