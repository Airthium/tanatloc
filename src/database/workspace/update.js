import query from '..'
import { databases } from '../../../config/db'

/**
 * Update
 * @memberof module:src/database/workspace
 * @param {Object} body { workspace { id }, data {key: value } }
 */
const update = async ({ workspace, data }) => {
  await Promise.all(
    Object.keys(data).map(async (key) => {
      return await query(
        'UPDATE ' +
          databases.WORKSPACES +
          ' SET ' +
          key +
          ' = $2 WHERE id = $1',
        [workspace.id, data[key]]
      )
    })
  )
}

export default update
