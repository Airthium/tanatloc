import isElectron from 'is-electron'

const base: string = isElectron() ? 'http://localhost:3000' : ''

/**
 * Login
 * @memberof API
 * @param {Object} user User `{ email, password }`
 */
export const login = async (user: {
  email: string
  password: string
}): Promise<{ ok: boolean; id?: string; isvalidated?: boolean }> => {
  const response = await fetch(base + '/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({ email: user.email, password: user.password })
  })

  if (response.status === 200) {
    return {
      ok: true,
      ...(await response.json())
    }
  }

  return {
    ok: false
  }
}
