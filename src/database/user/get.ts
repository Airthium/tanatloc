import { tables } from '@/config/db'

import { getter } from '..'

export type User = {
  id?: string
  lastname?: string
  firstname?: string
  email?: string
  avatar?: string
  isvalidated?: boolean
  lastmodificationdate?: Date
  superuser?: boolean
  passwordlastchanged?: Date
  organizations?: Array<string>
  workspaces?: Array<string>
  authorizedplugins?: Array<string>
  plugins?: Array<object>
}

/**
 * Get
 * @memberof Database.User
 * @param {string} id User's id (or key)
 * @param {Array} data Data
 * @param {string} [key=id] Key (override id selector)
 * @returns {Object} User `{ [key], ...data }`
 */
export const get = async (
  id: string,
  data: Array<string>,
  key: string = 'id'
): Promise<User> => {
  const response = await getter(tables.USERS, id, data, key)

  const user = response.rows[0]
  user && (user[key] = id)

  return user
}
