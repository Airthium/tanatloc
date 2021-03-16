import { getter } from '..'
import { databases } from '@/config/db'

/**
 * Get project by id
 * @memberof module:database/project
 * @param {string} id Id
 * @param {Array} data Data
 */
const get = async (id, data) => {
  const response = await getter(databases.PROJECTS, id, data)

  const project = response.rows[0]
  project && (project.id = id)

  return project
}

export default get
