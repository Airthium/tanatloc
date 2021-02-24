/** @module src/lib/workspace */

import WorkspaceDB from '@/database/workspace'

import User from './user'
import Group from './group'
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
  if (workspace?.owners) {
    const owners = await Promise.all(
      workspace.owners.map(async (owner) => {
        const ownerData = await User.get(owner, [
          'lastname',
          'firstname',
          'email',
          'avatar'
        ])
        return {
          id: owner,
          ...ownerData
        }
      })
    )
    workspace.owners = owners
  }

  // Get users
  if (workspace?.users) {
    const users = await Promise.all(
      workspace.users.map(async (user) => {
        const userData = await User.get(user, [
          'lastname',
          'firstname',
          'email',
          'avatar'
        ])
        return {
          id: user,
          ...userData
        }
      })
    )
    workspace.users = users
  }

  if (workspace?.groups) {
    const groups = await Promise.all(
      workspace.groups.map(async (group) => {
        const groupData = await Group.get(group, ['name'])
        return {
          id: group,
          ...groupData
        }
      })
    )
    workspace.groups = groups
  }

  return workspace
}

/**
 * Get workspaces by user
 * @param {Object} user User { id }
 */
const getByUser = async ({ id }) => {
  // Get workspaces'ids
  const user = await User.get(id, ['groups', 'workspaces'])

  let workspaces = []

  // Get local workspaces
  if (user.workspaces) {
    const localWorkspaces = await Promise.all(
      user.workspaces.map(async (workspace) => {
        const data = await get(workspace, [
          'name',
          'owners',
          'users',
          'groups',
          'projects'
        ])
        return {
          id: workspace,
          ...data
        }
      })
    )

    workspaces = [...localWorkspaces, ...workspaces]
  }

  // Get groups workspaces
  if (user.groups) {
    const groups = await Promise.all(
      user.groups.map(async (group) => {
        const groupData = await Group.get(group, ['workspaces'])

        if (groupData.workspaces) {
          return await Promise.all(
            groupData.workspaces.map(async (workspace) => {
              if (workspaces.find((w) => w.id === workspace)) return
              const data = await get(workspace, [
                'name',
                'owners',
                'users',
                'groups',
                'projects'
              ])
              return {
                id: workspace,
                ...data
              }
            })
          )
        }
      })
    )

    const groupWorkspaces = groups.flatMap((g) => g).filter((g) => g)
    workspaces = [...groupWorkspaces, ...workspaces]
  }

  return workspaces
}

/**
 * Update workspace
 * @param {Object} workspace Workspace { id }
 * @param {Object} data Data [{ key, value, ... }, ...]
 */
const update = async (workspace, data) => {
  // Get data
  const workspaceData = await get(workspace.id, ['groups'])
  if (!workspaceData.groups) workspaceData.groups = []

  // Check groups
  const groupsUpdate = data.find((d) => d.key === 'groups' && !d.type)
  if (groupsUpdate) {
    // Deleted groups
    const deleted = workspaceData.groups.filter(
      (g) => !groupsUpdate.value.includes(g.id)
    )

    await Promise.all(
      deleted.map(async (group) => {
        await Group.update({ id: group.id }, [
          {
            key: 'workspaces',
            type: 'array',
            method: 'remove',
            value: workspace.id
          }
        ])
      })
    )

    // Added groups
    const added = groupsUpdate.value.filter(
      (g) => !workspaceData.groups.find((gg) => gg.id === g)
    )
    await Promise.all(
      added.map(async (group) => {
        await Group.update({ id: group.id }, [
          {
            key: 'workspaces',
            type: 'array',
            method: 'append',
            value: workspace.id
          }
        ])
      })
    )
  }

  // Update workspace
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
