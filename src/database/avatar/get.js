import { getter } from '..'
import { databases } from '../../../config/db'

/**
 * Get avatar by id
 * @memberof module:src/database/avatar
 * @param {string} id Avatar's id
 * @param {Object} data Data
 */
const get = async (id, data) => {
  const response = await getter(databases.AVATARS, id, data)
  const avatar = response.rows[0]
  avatar.id = id

  return avatar
}

export default get
