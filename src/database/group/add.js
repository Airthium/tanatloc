import query from '..'
import { databases } from '@/config/db'

/**
 * Add
 * @param {Object} group Group { name, users }
 */
const add = async ({ name, users }) => {
  const response = await query(
    'INSERT INTO ' +
      databases.GROUPS +
      ' (name, users) VALUES ($1, $2) RETURNING id',
    [name, users]
  )

  return response.rows[0]
}

export default add
