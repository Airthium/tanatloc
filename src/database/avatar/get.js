import { getter } from '..'
import { tables } from '@/config/db'

/**
 * Get
 * @memberof Database.Avatar
 * @param {string} id Avatar's id
 * @param {Array} data Data
 * @returns {Object} Avatar `{ id, ...data }`
 */
const get = async (id, data) => {
  const response = await getter(tables.AVATARS, id, data)

  const avatar = response.rows[0]
  avatar && (avatar.id = id)

  return avatar
}

export default get
