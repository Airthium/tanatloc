import query from '..'
import { tables } from '@/config/db'

/**
 * Add
 * @memberof Database.Organization
 * @param {Object} organization Organization { name, owners }
 * @returns {Object} Organization { id, name, owners }
 */
const add = async ({ name, owners }) => {
  const response = await query(
    'INSERT INTO ' +
      tables.ORGANIZATIONS +
      ' (name, owners) VALUES ($1, $2) RETURNING id',
    [name, owners]
  )

  const organization = response.rows[0]
  organization && (organization.name = name)
  organization && (organization.owners = owners)

  return organization
}

export default add
