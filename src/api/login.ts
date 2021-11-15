import isElectron from 'is-electron'

import { ICallResponse } from '.'

const base: string = isElectron() ? 'http://localhost:3000' : ''

/**
 * Login
 * @memberof API
 * @param {Object} user User `{ email, password }`
 */
export const login = async (user: {
  email: string
  password: string
}): Promise<ICallResponse | JSON> => {
  const response = await fetch(base + '/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({ email: user.email, password: user.password })
  })

  if (response.status === 200) {
    return response.json()
  }

  return response
}
