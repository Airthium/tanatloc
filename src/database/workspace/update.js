import { updater } from '..'
import { tables } from '@/config/db'

/**
 * Update
 * @memberof Database.Workspace
 * @param {Object} workspace workspace { id }
 * @param {Object} data Data [{ key, value, ... }, ... ]
 */
const update = async (workspace, data) => {
  await updater(tables.WORKSPACES, workspace.id, data)
}

export default update
