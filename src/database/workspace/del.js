import { deleter } from '..'
import { databases } from '@/config/db'

/**
 * Delete
 * @memberof module:src/database/workspace
 * @param {Object} workspace Workspace { id }
 */
const del = async (workspace) => {
  // Delete workspace
  await deleter(databases.WORKSPACES, workspace.id)
}

export default del
