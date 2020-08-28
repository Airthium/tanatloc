import query from '..'
import { databases } from '../../../config/db'

/**
 * Delete
 * @memberof module:src/database/workspace
 * @param {Object} workspace Workspace { id }
 */
const del = async (workspace) => {
  // Delete workspace
  await query('DELETE FROM ' + databases.WORKSPACES + ' WHERE id = $1', [
    workspace.id
  ])
}

export default del
