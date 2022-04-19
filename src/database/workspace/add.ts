/** @module Database.Workspace.Add */

import { tables } from '@/config/db'

import { query } from '..'

export interface INewWorkspace {
  id: string
  name: string
  owners: string[]
}

/**
 * Add
 * @param user User
 * @param workspace Workspace
 * @returns New workspace
 */
export const add = async (
  user: { id: string },
  workspace: { name: string }
): Promise<INewWorkspace> => {
  const response = await query(
    'INSERT INTO ' +
      tables.WORKSPACES +
      ' (name, owners, projects) VALUES ($1, $2, $3) RETURNING id',
    [workspace.name, [user.id], []]
  )

  const newWorkspace = response.rows[0]
  newWorkspace && (newWorkspace.name = workspace.name)
  newWorkspace && (newWorkspace.owners = [user.id])

  return newWorkspace
}
