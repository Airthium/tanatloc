import { deleter } from '..'
import { databases } from '@/config/db'

/**
 * Delete project
 * @memberof module:database/project
 * @param {Object} project Project { id }
 */
const del = async (project) => {
  await deleter(databases.PROJECTS, project.id)
}

export default del
