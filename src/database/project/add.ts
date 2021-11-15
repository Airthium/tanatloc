import { tables } from '@/config/db'

import { query } from '..'
import { INewProject } from '../index.d'

/**
 * Add
 * @memberof Database.Project
 * @param {Object} user User `{ id }`
 * @param {Object} workspace Workspace `{ id }`
 * @param {Object} project Project `{ title, description }`
 * @returns {Object} Project `{ id, title, description, owners, workspace }`
 */
export const add = async (
  user: { id: string },
  workspace: { id: string },
  project: { title: string; description?: string }
): Promise<INewProject> => {
  const response = await query(
    'INSERT INTO ' +
      tables.PROJECTS +
      ' (title, description, public, createdDate, lastAccess, owners, workspace) VALUES ($1, $2, $3, to_timestamp($4), to_timestamp($4), $5, $6) RETURNING id',
    [
      project.title,
      project.description || '',
      false,
      Date.now() / 1000,
      [user.id],
      workspace.id
    ]
  )

  const newProject = response.rows[0]
  newProject && (newProject.title = project.title)
  newProject && (newProject.description = project.description || '')
  newProject && (newProject.owners = [user.id])
  newProject && (newProject.workspace = workspace.id)

  return newProject
}
