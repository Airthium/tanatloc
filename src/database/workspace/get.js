import { getter } from '..'
import { databases } from '../../../config/db'

/**
 * Get by user id
 * @memberof module:src/database/workspace
 * @param {string} id Id
 * @param {Array} data Data
 */
const get = async (id, data) => {
  const response = await getter(databases.WORKSPACES, id, data)

  const workspace = response.rows[0]
  workspace && (workspace.id = id)

  return workspace
}

export default get
