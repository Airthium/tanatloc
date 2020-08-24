import query from '..'
import { databases } from '../../../config/db'

/**
 * Add
 * @memberof module:src/database/workspace
 * @param {string} id User id
 * @param {Object} workspace Workspace { name }
 */
const add = async (id, { name }) => {
  const response = await query(
    'INSERT INTO ' +
      databases.WORKSPACES +
      ' (name, owners) VALUES ($1, $2) RETURNING id',
    [name, [id]]
  )

  const workspace = response.rows[0]

  await query(
    'UPDATE ' +
      databases.USERS +
      ' SET workspaces = array_append(workspaces, $2) WHERE id = $1',
    [id, workspace.id]
  )

  return workspace
}

export default add
