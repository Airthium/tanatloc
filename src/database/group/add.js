import query from '..'
import { tables } from '@/config/db'

/**
 * Add
 * @param {Object} organization Organization
 * @param {Object} group Group { name, users }
 */
const add = async (organization, { name, users }) => {
  const response = await query(
    'INSERT INTO ' +
      tables.GROUPS +
      ' (name, users, organization) VALUES ($1, $2, $3) RETURNING id',
    [name, users, organization.id]
  )

  return response.rows[0]
}

export default add
