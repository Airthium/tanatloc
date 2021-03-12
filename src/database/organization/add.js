import query from '..'
import { databases } from '@/config/db'

/**
 * Add
 * @param {Object} organization Organization { name, owners }
 */
const add = async ({ name, owners }) => {
  const response = await query(
    'INSERT INTO ' +
      databases.ORGANIZATIONS +
      ' (name, owners) VALUES ($1, $2) RETURNING id',
    [name, owners]
  )

  return response.rows[0]
}

export default add
