/** @module src/lib/user */

import { get as dBget, getByUsernameAndPassword } from '../database/user'

const get = async (id) => {
  const user = await dBget(id, ['lastname, firstname, email, avatar'])
  return user
}

const login = async ({ username, password }) => {
  const user = await getByUsernameAndPassword({ username, password })

  if (!user) return null

  return {
    ...user,
    username: username
  }
}

export { login, get }
