import query from '..'
import { databases } from '../../../config/db'

/**
 * Get user by id
 * @memberof module:src/database/user
 * @param {string} id Id
 * @param {Array} data Data
 * @returns {Object} User
 */
const getById = async (id, data = ['email']) => {
  const response = await query(
    'SELECT ' + data.join(',') + ' FROM ' + databases.USERS + ' WHERE id = $1',
    [id]
  )

  const result = response.rows[0]
  result.username = result.email // TODO modify the dB for that
  delete result.email
  const user = {
    id: id,
    ...result
  }
  return user
}

export default getById
