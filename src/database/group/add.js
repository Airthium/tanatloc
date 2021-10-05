import query from '..'
import { tables } from '@/config/db'

/**
 * Add
 * @memberof Database.Group
 * @param {Object} organization Organization
 * @param {Object} group Group `{ name, users }`
 * @returns {Object} Group `{ id, name, users, organization }`
 */
const add = async (organization, { name, users }) => {
  const response = await query(
    'INSERT INTO ' +
      tables.GROUPS +
      ' (name, users, organization) VALUES ($1, $2, $3) RETURNING id',
    [name, users, organization.id]
  )

  const group = response.rows[0]
  group && (group.name = name)
  group && (group.users = users)
  group && (group.organization = organization.id)

  return group
}

export default add
