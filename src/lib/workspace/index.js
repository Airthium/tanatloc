/** @module lib/workspace */

import WorkspaceDB from '@/database/workspace'

import User from '../user'
import Group from '../group'
import Organization from '../organization'
import Project from '../project'

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

  // Get groups
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
  const user = await User.get(id, [
    'firstname',
    'lastname',
    'email',
    'avatar',
    'organizations',
    'workspaces'
  ])

  const workspaces = []

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

    workspaces.push(...localWorkspaces)
  }

  // Get organizations workspaces & projects
  if (user.organizations) {
    const groupWorkspaces = []
    const groupProjects = []
    await Promise.all(
      user.organizations.map(async (organization) => {
        const organizationData = await Organization.get(organization, [
          'groups'
        ])
        if (organizationData.groups) {
          await Promise.all(
            organizationData.groups.map(async (group) => {
              const groupData = await Group.get(group, [
                'name',
                'workspaces',
                'projects'
              ])

              // Workspaces
              if (groupData.workspaces) {
                await Promise.all(
                  groupData.workspaces.map(async (workspace) => {
                    const workspaceData = await get(workspace, [
                      'name',
                      'users',
                      'owners',
                      'groups',
                      'projects'
                    ])
                    if (!workspaceData.owners?.find((o) => o.id === id))
                      groupWorkspaces.push({
                        id: workspace,
                        ...workspaceData,
                        owners: []
                      })
                  })
                )
              }

              if (groupData.projects) {
                groupProjects.push({
                  id: '0',
                  name: 'Projects from ' + groupData.name,
                  owners: [],
                  groups: [
                    {
                      id: group,
                      name: groupData.name
                    }
                  ],
                  projects: groupData.projects
                })
              }
            })
          )
        }
      })
    )

    workspaces.push(...groupWorkspaces)
    workspaces.push(...groupProjects)
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
  const data = await get(workspace.id, ['groups', 'projects'])

  // Delete from groups
  if (data.groups) {
    await Promise.all(
      data.groups.map(async (group) => {
        await Group.update({ id: group.id }, [
          {
            key: 'workspaces',
            type: 'array',
            method: 'remove',
            vale: workspace.id
          }
        ])
      })
    )
  }

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

const Workspace = { add, get, getByUser, update, del }
export default Workspace
