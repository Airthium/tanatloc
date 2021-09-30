import { updater } from '..'
import { tables } from '@/config/db'

/**
 * Update
 * @memberof Database.Project
 * @param {Object} project Project { id }
 * @param {Array} data Data [{ key, value, ... }, ...]
 */
const update = async (project, data) => {
  await updater(tables.PROJECTS, project.id, data)
}

export default update
