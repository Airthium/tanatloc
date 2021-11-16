import { INewUser } from '@/database/index.d'

import { call } from '@/api/call'

/**
 * Add
 * @memberof API.User
 * @param user User
 * @returns User
 */
export const add = async (user: {
  email: string
  password: string
}): Promise<INewUser> => {
  const response = await call('/api/user', {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    },
    body: JSON.stringify(user)
  })

  return response.json()
}
