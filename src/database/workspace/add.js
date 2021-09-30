import query from '..'
import { tables } from '@/config/db'

/**
 * Add
 * @memberof Database.Workspace
 * @param {string} user User { id }
 * @param {Object} workspace Workspace { name }
 * @returns {Object} Workspace { id, name, owners }
 */
const add = async ({ id }, { name }) => {
  const response = await query(
    'INSERT INTO ' +
      tables.WORKSPACES +
      ' (name, owners, projects) VALUES ($1, $2, $3) RETURNING id',
    [name, [id], []]
  )

  const workspace = response.rows[0]
  workspace && (workspace.name = name)
  workspace && (workspace.owners = [id])

  return workspace
}

export default add
