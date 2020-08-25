import query from '..'
import { databases } from '../../../config/db'

/**
 * Add
 * @memberof module:src/database/project
 * @param {string} id Workspace id
 * @param {Object} project Project
 */
const add = async (user, { id, project }) => {
  // TODO do the same things as workspace add
  const response = await query(
    'INSERT INTO ' +
      databases.PROJECT +
      ' (title, description, owners) VALUES ($1, $2) RETURNING id',
    [project.title, project.description, [user]]
  )

  const p = response.rows[0]

  await query(
    'UPDATE ' +
      databases.WORKSPACES +
      ' SET projects = array_append(projects, $2) WHERE id = $1',
    [id, p.id]
  )

  return p
}

export default add
