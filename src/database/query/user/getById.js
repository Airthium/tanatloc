import query from '../..'
import { databases } from '../../../../config/db'

/**
 * Get user by id
 * @param {string} id Id
 * @param {Array} data Data
 */
export default async (id, data = ['email']) => {
  const response = await query(
    'SELECT ' + data.join(',') + ' FROM ' + databases.USERS + ' WHERE id = $1',
    [id]
  )

  const result = response.rows[0]
  result.username = result.email
  delete result.email
  const user = {
    id: id,
    ...result
  }
  return user
}
