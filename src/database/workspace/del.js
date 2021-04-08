import { deleter } from '..'
import { tables } from '@/config/db'

/**
 * Delete
 * @memberof module:database/workspace
 * @param {Object} workspace Workspace { id }
 */
const del = async (workspace) => {
  // Delete workspace
  await deleter(tables.WORKSPACES, workspace.id)
}

export default del
