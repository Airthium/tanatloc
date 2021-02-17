/** @module src/lib/workspace */

import WorkspaceDB from '@/database/workspace'

import User from './user'
import Project from './project'

/**
 * Add workspace
 * @param {Object} user User { id }
 * @param {Object} workspace Workspace { name }
 */
const add = async (user, { name }) => {
  // Add workspace
  const workspace = await WorkspaceDB.add(user, { name })

  // Add workspace to user
  await User.update(user, [
    {
      type: 'array',
      method: 'append',
      key: 'workspaces',
      value: workspace.id
    }
  ])

  // Return
  return workspace
}

/**
 * Get workspace
 * @param {string} id Id
 * @param {Array} data Data
 */
const get = async (id, data) => {
  const workspace = await WorkspaceDB.get(id, data)

  // Get owners
  if (workspace && workspace.owners) {
    const owners = await Promise.all(
      workspace.owners.map(async (owner) => {
        return User.get(owner, ['lastname', 'firstname', 'email', 'avatar'])
      })
    )
    workspace.owners = owners
  }

  // Get users
  if (workspace.users) {
    const users = await Promise.all(
      workspace.users.map(async (user) => {
        return User.get(user, ['lastname', 'firstname', 'email', 'avatar'])
      })
    )
    workspace.users = users
  }

  return workspace
}

/**
 * Get workspaces by user
 * @param {Object} user User { id }
 */
const getByUser = async ({ id }) => {
  // Get workspaces'ids
  const user = await User.get(id, ['workspaces'])

  // Get workspaces data
  if (user.workspaces) {
    return Promise.all(
      user.workspaces.map(async (workspace) => {
        const data = await get(workspace, [
          'name',
          'owners',
          'users',
          'projects'
        ])
        return {
          ...data,
          id: workspace
        }
      })
    )
  }

  return []
}

/**
 * Update workspace
 * @param {Object} workspace Workspace { id }
 * @param {Object} data Data [{ key, value, ... }, ...]
 */
const update = async (workspace, data) => {
  await WorkspaceDB.update(workspace, data)
}

/**
 *
 * @param {Object} user User { id }
 * @param {Object} workspace Workspace { id }
 */
const del = async (user, workspace) => {
  // Get data
  const data = await get(workspace.id, ['projects'])

  // Delete projects
  if (data.projects) {
    await Promise.all(
      data.projects.map(async (project) => {
        await Project.del(workspace, { id: project })
      })
    )
  }

  // Delete workspace
  await WorkspaceDB.del(workspace)

  // Delete workspace reference in user
  await User.update(user, [
    {
      type: 'array',
      method: 'remove',
      key: 'workspaces',
      value: workspace.id
    }
  ])
}

export default { add, get, getByUser, update, del }
