import query from '..'
import { databases } from '../../../config/db'

/**
 * Add
 * @memberof module:src/database/project
 * @param {string} user User id
 * @param {Object} param2 { id: Workspace id, project: { title, description } }
 */
const add = async (user, { id, project: { title, description } }) => {
  const response = await query(
    'INSERT INTO ' +
      databases.PROJECTS +
      ' (title, description, public, createdDate, lastAccess, owners) VALUES ($1, $2, $3, to_timestamp($4), to_timestamp($4), $5) RETURNING id',
    [title, description || '', false, Date.now() / 1000, [user]]
  )

  const p = response.rows[0]

  await query(
    'UPDATE ' +
      databases.WORKSPACES +
      ' SET projects = array_append(projects, $2) WHERE id = $1',
    [id, p.id]
  )

  return {
    ...p,
    title,
    description
  }
}

export default add
