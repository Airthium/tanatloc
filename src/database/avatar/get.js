import { getter } from '..'
import { databases } from '../../../config/db'

/**
 * Get avatar by id
 * @param {string} id Id
 * @param {Object} data Data
 */
const get = async (id, data) => {
  const response = await getter(databases.AVATARS, id, data)
  const avatar = response.rows[0]
  avatar.id = id

  return avatar
}

export default get
