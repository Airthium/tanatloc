import query from '..'
import { databases } from '../../../config/db'

/**
 * Delete
 * @memberof module:src/database/workspace
 * @param {string} id User id
 * @param {object} workspace Workspace { id }
 */
const del = async (id, workspace) => {
  // Delete workspace
  await query('DELETE FROM ' + databases.WORKSPACES + ' WHERE id = $1', [
    workspace.id
  ])

  // Delete workspace reference in user
  await query(
    'UPDATE ' +
      databases.USERS +
      ' SET workspaces = array_remove(workspaces, $2) WHERE id = $1',
    [id, workspace.id]
  )
}

export default del
