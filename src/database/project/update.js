import { updater } from '..'
import { tables } from '@/config/db'

/**
 * Update
 * @memberof module:database/project
 * @param {Object} project Project { id }
 * @param {Array} data Data [{ key, value, ... }, ...]
 */
const update = async (project, data) => {
  return updater(tables.PROJECTS, project.id, data)
}

export default update
