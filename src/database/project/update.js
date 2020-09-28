import { updater } from '..'
import { databases } from '../../../config/db'

/**
 * Update
 * @memberof module:src/database/project
 * @param {Object} project Project { id }
 * @param {Object} data Data [{ type: type, method: method, key: key, value: value }]
 */
const update = async (project, data) => {
  await Promise.all(
    data.map(async (d) => {
      return await updater(databases.PROJECTS, project.id, d)
    })
  )
}

export default update
