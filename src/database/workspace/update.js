import { updater } from '..'
import { tables } from '@/config/db'

/**
 * Update
 * @memberof module:database/workspace
 * @param {Object} workspace workspace { id }
 * @param {Object} data Data [{ key, value, ... }, ... ]
 */
const update = async (workspace, data) => {
  return updater(tables.WORKSPACES, workspace.id, data)
}

export default update
