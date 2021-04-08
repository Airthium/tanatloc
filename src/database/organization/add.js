import query from '..'
import { tables } from '@/config/db'

/**
 * Add
 * @memberof module:database/organization
 * @param {Object} organization Organization { name, owners }
 */
const add = async ({ name, owners }) => {
  const response = await query(
    'INSERT INTO ' +
      tables.ORGANIZATIONS +
      ' (name, owners) VALUES ($1, $2) RETURNING id',
    [name, owners]
  )

  return response.rows[0]
}

export default add
