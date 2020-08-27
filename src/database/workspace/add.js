import query from '..'
import { databases } from '../../../config/db'

/**
 * Add
 * @memberof module:src/database/workspace
 * @param {string} user User { id }
 * @param {Object} workspace Workspace { name }
 */
const add = async ({ id }, { name }) => {
  const response = await query(
    'INSERT INTO ' +
      databases.WORKSPACES +
      ' (name, owners) VALUES ($1, $2) RETURNING id',
    [name, [id]]
  )

  const workspace = response.rows[0]
  workspace.name = name

  return workspace
}

export default add
