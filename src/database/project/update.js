import { updater } from '..'
import { databases } from '@/config/db'

/**
 * Update
 * @memberof module:src/database/project
 * @param {Object} project Project { id }
 * @param {Array} data Data [{ key, value, ... }, ...]
 */
const update = async (project, data) => {
  return updater(databases.PROJECTS, project.id, data)
}

export default update
