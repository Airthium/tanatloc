import query from '..'
import { tables } from '@/config/db'

/**
 * Add
 * @memberof Database.Project
 * @param {Object} user User { id }
 * @param {Object} workspace Workspace { id }
 * @param {Object} project Project { title, description }
 * @returns {Object} Project { id, title, description, owners, workspace }
 */
const add = async (user, workspace, { title, description }) => {
  const response = await query(
    'INSERT INTO ' +
      tables.PROJECTS +
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
  project && (project.title = title)
  project && (project.description = description || '')
  project && (project.owners = [user.id])
  project && (project.workspace = workspace.id)

  return project
}

export default add
