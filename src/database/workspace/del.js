import { deleter } from '..'
import { tables } from '@/config/db'

/**
 * Delete
 * @memberof Database.Workspace
 * @param {Object} workspace Workspace { id }
 */
const del = async (workspace) => {
  // Delete workspace
  await deleter(tables.WORKSPACES, workspace.id)
}

export default del
