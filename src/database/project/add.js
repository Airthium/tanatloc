import query from '..'
import { databases } from '../../../config/db'

/**
 * Add
 * @memberof module:src/database/project
 * @param {string} user User id
 * @param {Object} param2 { title, description }
 */
const add = async ({ id }, { title, description }) => {
  const response = await query(
    'INSERT INTO ' +
      databases.PROJECTS +
      ' (title, description, public, createdDate, lastAccess, owners) VALUES ($1, $2, $3, to_timestamp($4), to_timestamp($4), $5) RETURNING id',
    [title, description || '', false, Date.now() / 1000, [id]]
  )

  const project = response.rows[0]
  project.title = title
  project.description = description

  return project
}

export default add
