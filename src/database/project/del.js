import { deleter } from '..'
import { tables } from '@/config/db'

/**
 * Delete
 * @memberof Database.Project
 * @param {Object} project Project { id }
 */
const del = async (project) => {
  await deleter(tables.PROJECTS, project.id)
}

export default del
