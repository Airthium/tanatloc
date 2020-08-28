import { updater } from '..'
import { databases } from '../../../config/db'

/**
 * Update
 * @memberof module:src/database/project
 * @param {Object} param0 { project: { id }, data: [{ type: type, method: method, key: key, value: value }] }
 */
const update = async ({ project, data }) => {
  await Promise.all(
    data.map(async (d) => {
      return await updater(databases.PROJECTS, project.id, d)
    })
  )
}

export default update
