import { getter } from '..'
import { tables } from '@/config/db'

/**
 * Get avatar by id
 * @memberof module:database/avatar
 * @param {string} id Avatar's id
 * @param {Object} data Data { key, value, ... }
 */
const get = async (id, data) => {
  const response = await getter(tables.AVATARS, id, data)

  const avatar = response.rows[0]
  avatar && (avatar.id = id)

  return avatar
}

export default get
