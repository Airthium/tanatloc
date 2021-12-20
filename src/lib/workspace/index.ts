/** @module Lib.Workspace */

import WorkspaceDB from '@/database/workspace'
import { IDataBaseEntry, INewWorkspace, IWorkspace } from '@/database/index.d'

import { IWorkspaceWithData } from '../index.d'

import User from '../user'
import Group from '../group'
import Organization from '../organization'
import Project from '../project'

/**
 * Add
 * @memberof Lib.Workspace
 * @param user User
 * @param workspace Workspace
 * @returns Workspace
 */
const add = async (
  user: { id: string },
  workspace: { name: string }
): Promise<INewWorkspace> => {
  // Add workspace
  const newWorkspace = await WorkspaceDB.add(user, workspace)

  // Add workspace to user
  await User.update(user, [
    {
      type: 'array',
      method: 'append',
      key: 'workspaces',
      value: newWorkspace.id
    }
  ])

  // Return
  return newWorkspace
}

/**
 * Get
 * @param id Id
 * @param data Data
 * @returns Workspace
 */
const get = async (id: string, data: string[]): Promise<IWorkspace> => {
  return WorkspaceDB.get(id, data)
}

/**
 * Get with data
 * @memberof Lib.Workspace
 * @param id Id
 * @param data Data
 * @returns Workspace
 */
const getWithData = async (
  id: string,
  data: Array<string>
): Promise<IWorkspaceWithData> => {
  const workspace = await get(id, data)

  const { owners, users, groups, ...workspaceData } = { ...workspace }
  const workspaceWithData: IWorkspaceWithData = { ...workspaceData }
  // Get owners
  if (workspace?.owners) {
    const ownersData = await Promise.all(
      workspace.owners.map(async (owner) => {
        const ownerData = await User.getWithData(owner, [
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
    workspaceWithData.owners = ownersData
  }

  // Get users
  if (workspace?.users) {
    const usersData = await Promise.all(
      workspace.users.map(async (user) => {
        const userData = await User.getWithData(user, [
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
    workspaceWithData.users = usersData
  }

  // Get groups
  if (workspace?.groups) {
    const groupsData = await Promise.all(
      workspace.groups.map(async (group) => {
        const groupData = await Group.getWithData(group, ['name'])
        return {
          id: group,
          ...groupData
        }
      })
    )
    workspaceWithData.groups = groupsData
  }

  return workspaceWithData
}

/**
 * Get by user
 * @memberof Lib.Workspace
 * @param user User
 * @returns Workspaces
 */
const getByUser = async ({
  id
}: {
  id: string
}): Promise<IWorkspaceWithData[]> => {
  // Get workspaces'ids
  const user = await User.get(id, ['organizations', 'workspaces'])

  const workspaces = []

  // Get local workspaces
  if (user.workspaces) {
    const localWorkspaces = await Promise.all(
      user.workspaces.map(async (workspace) => {
        const data = await getWithData(workspace, [
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
                    const workspaceData = await getWithData(workspace, [
                      'name',
                      'users',
                      'owners',
                      'groups',
                      'projects'
                    ])
                    if (
                      !workspaceData.owners?.find(
                        (o: IWorkspaceWithData) => o.id === id
                      )
                    )
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
 * Delete from group
 * @param group Group
 * @param workspace Workspace
 */
const deleteFromGroup = async (
  group: { id: string },
  workspace: { id: string }
) => {
  await Group.update({ id: group.id }, [
    {
      key: 'workspaces',
      type: 'array',
      method: 'remove',
      value: workspace.id
    }
  ])
}

/**
 * Update
 * @memberof Lib.Workspace
 * @param workspace Workspace
 * @param data Data
 */
const update = async (
  workspace: { id: string },
  data: IDataBaseEntry[]
): Promise<void> => {
  // Get data
  const workspaceData = await getWithData(workspace.id, ['groups'])
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
        await deleteFromGroup(group, workspace)
      })
    )

    // Added groups
    const added = groupsUpdate.value.filter(
      (group: string) => !workspaceData.groups.find((g) => g.id === group)
    )
    await Promise.all(
      added.map(async (group: { id: string }) => {
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
 * Delete
 * @memberof Lib.Workspace
 * @param user User
 * @param workspace Workspace
 */
const del = async (
  user: { id: string },
  workspace: { id: string }
): Promise<void> => {
  // Get data
  const data = await getWithData(workspace.id, ['groups', 'projects'])

  // Delete from groups
  if (data.groups) {
    await Promise.all(
      data.groups.map(async (group) => {
        await deleteFromGroup(group, workspace)
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

const Workspace = { add, get, getWithData, getByUser, update, del }
export default Workspace
