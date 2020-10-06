import { updater } from '..'
import { databases } from '../../../config/db'

/**
 * Update
 * @memberof module:src/database/workspace
 * @param {Object} workspace workspace { id }
 * @param {Object} data Data [{ key, value, ... }, ... ]
 */
const update = async (workspace, data) => {
  await Promise.all(
    data.map(async (d) => {
      return await updater(databases.WORKSPACES, workspace.id, d)
    })
  )
}

export default update
