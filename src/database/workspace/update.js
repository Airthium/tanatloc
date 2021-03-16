import { updater } from '..'
import { databases } from '@/config/db'

/**
 * Update
 * @memberof module:database/workspace
 * @param {Object} workspace workspace { id }
 * @param {Object} data Data [{ key, value, ... }, ... ]
 */
const update = async (workspace, data) => {
  return updater(databases.WORKSPACES, workspace.id, data)
}

export default update
