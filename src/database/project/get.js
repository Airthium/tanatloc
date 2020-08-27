import { getter } from '..'
import { databases } from '../../../config/db'

/**
 * Get project by id
 * @memberof module:src/database/project
 * @param {string} id Id
 */
const get = async (id) => {
  const response = await getter(databases.PROJECTS, id, [
    'title',
    'description',
    'avatar',
    'owners',
    'users'
  ])
  const project = response.rows[0]
  project.id = id

  return project
}

export default get
