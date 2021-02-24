import query from '..'
import { databases } from '@/config/db'

/**
 * Add
 * @memberof module:src/database/project
 * @param {Object} user User { id }
 * @param {Object} workspace Workspace { id }
 * @param {Object} project Project { title, description }
 */
const add = async (user, workspace, { title, description }) => {
  const response = await query(
    'INSERT INTO ' +
      databases.PROJECTS +
      ' (title, description, public, createdDate, lastAccess, owners, workspace) VALUES ($1, $2, $3, to_timestamp($4), to_timestamp($4), $5, $6) RETURNING id',
    [
      title,
      description || '',
      false,
      Date.now() / 1000,
      [user.id],
      workspace.id
    ]
  )

  const project = response.rows[0]
  project.title = title
  project.description = description || ''

  return project
}

export default add
