import { tables } from '@/config/db'

import query from '..'

type NewWorkspace = {
  id: string
  name: string
  owners: Array<string>
}

/**
 * Add
 * @memberof Database.Workspace
 * @param {string} user User `{ id }`
 * @param {Object} workspace Workspace `{ name }`
 * @returns {Object} Workspace `{ id, name, owners }`
 */
export const add = async (
  user: { id: string },
  workspace: { name: string }
): Promise<NewWorkspace> => {
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
