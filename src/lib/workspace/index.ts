/** @module Lib.Workspace */

import { IDataBaseEntry } from '@/database/index.d'
import {
  IGroupWithData,
  IOrganizationWithData,
  IUserWithData,
  IWorkspaceGet,
  IWorkspaceWithData
} from '../index.d'

import { LIMIT50 } from '@/config/string'

import WorkspaceDB, { INewWorkspace, TWorkspaceGet } from '@/database/workspace'

import User from '../user'
import Group from '../group'
import Organization from '../organization'
import Project from '../project'

/**
 * Custom Types
 */
export type TWorkspace = IWorkspaceWithData<
  ('name' | 'owners' | 'users' | 'groups' | 'projects')[]
>

/**
 * Add
 * @param user User
 * @param workspace Workspace
 * @returns Workspace
 */
const add = async (
  user: { id: string },
  workspace: { name: string }
): Promise<INewWorkspace> => {
  // Check name
  workspace.name = workspace.name.substring(0, LIMIT50).trim()

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
const get = async <T extends TWorkspaceGet>(
  id: string,
  data: T
): Promise<IWorkspaceGet<T> | undefined> => {
  const workspaceData = await WorkspaceDB.get(id, data)
  if (!workspaceData) return

  if (data.includes('owners') && !workspaceData.owners)
    workspaceData.owners = []

  if (data.includes('users') && !workspaceData.users) workspaceData.users = []

  if (data.includes('groups') && !workspaceData.groups)
    workspaceData.groups = []

  if (data.includes('projects') && !workspaceData.projects)
    workspaceData.projects = []

  if (data.includes('archivedprojects') && !workspaceData.archivedprojects)
    workspaceData.archivedprojects = []

  return workspaceData as IWorkspaceGet<T>
}

/**
 * Get users data
 * @param users Users
 * @returns Users data
 */
const getUsersData = async (
  users: string[]
): Promise<
  IUserWithData<('email' | 'lastname' | 'firstname' | 'avatar')[]>[]
> => {
  if (!users) return []

  const usersData = []
  for (const user of users) {
    const userData = await User.getWithData(user, [
      'lastname',
      'firstname',
      'email',
      'avatar'
    ])
    if (!userData) continue

    usersData.push(userData)
  }
  return usersData
}

/**
 * Get groups data
 * @param groups Groups
 * @returns Groups data
 */
const getGroupsData = async (
  groups: string[]
): Promise<IGroupWithData<'name'[]>[]> => {
  if (!groups) return []

  const groupsData = []
  for (const group of groups) {
    const groupData = await Group.getWithData(group, ['name'])
    if (!groupData) continue

    groupsData.push(groupData)
  }

  return groupsData
}

/**
 * Get with data
 * @param id Id
 * @param data Data
 * @returns Workspace
 */
const getWithData = async <T extends TWorkspaceGet>(
  id: string,
  data: T
): Promise<IWorkspaceWithData<T> | undefined> => {
  const workspace = await get(id, data)
  if (!workspace) return

  const { owners, users, groups, ...workspaceData } = workspace

  // Get owners
  const ownersData = await getUsersData(owners)

  // Get users
  const usersData = await getUsersData(users)

  // Get groups
  const groupsData = await getGroupsData(groups)

  // Return
  return {
    ...workspaceData,
    users: usersData,
    owners: ownersData,
    groups: groupsData
  } as IWorkspaceWithData<T>
}

/**
 * Get workspaces
 * @param workspaces Workspaces
 * @returns Workspace
 */
const getWorkspaces = async (workspaces: string[]): Promise<TWorkspace[]> => {
  const workspacesData = []
  for (const workspace of workspaces) {
    const workspaceData = await getWithData(workspace, [
      'name',
      'owners',
      'users',
      'groups',
      'projects'
    ])
    if (!workspaceData) continue

    workspacesData.push(workspaceData)
  }
  return workspacesData
}

/**
 * Get organizations data
 * @param user User
 * @param organizations Organizations
 * @returns Data
 */
const getOrganizationsData = async (
  user: { id: string },
  organizations: IOrganizationWithData<'groups'[]>[]
): Promise<{
  groupsWorkspaces: TWorkspace[]
  groupsProjects: TWorkspace[]
}> => {
  const groupsWorkspaces: TWorkspace[] = []
  const groupsProjects: TWorkspace[] = []
  for (const organization of organizations) {
    for (const group of organization.groups) {
      const groupData = await Group.get(group.id, [
        'name',
        'users',
        'workspaces',
        'projects'
      ])
      if (!groupData) continue

      if (!groupData.users.find((u) => u === user.id)) continue

      // Workspaces
      if (groupData.workspaces.length) {
        const groupWorkspaces = await getWorkspaces(groupData.workspaces)

        groupsWorkspaces.push(
          ...groupWorkspaces.filter(
            (w) => !w.owners.find((o) => o.id === user.id)
          )
        )
      }

      // Projects
      if (groupData.projects.length) {
        const customGroup = {
          id: group.id,
          name: groupData.name
        } as IGroupWithData<'name'[]>
        const customWorkspace = {
          id: groupData.id,
          name: 'Projects from ' + groupData.name,
          owners: [],
          users: [],
          groups: [customGroup],
          projects: groupData.projects,
          archivedprojects: []
        }
        groupsProjects.push(customWorkspace)
      }
    }
  }

  return {
    groupsWorkspaces,
    groupsProjects
  }
}

/**
 * Get by user
 * @param user User
 * @returns Workspaces
 */
const getByUser = async ({ id }: { id: string }): Promise<TWorkspace[]> => {
  // Get workspaces'ids
  const user = await User.get(id, ['projects', 'workspaces'])
  if (!user) return []

  const organizations = await Organization.getByUser({ id }, ['groups'])
  const workspaces = []

  // Get local workspaces
  const localWorkspaces = await getWorkspaces(user.workspaces)
  workspaces.push(...localWorkspaces)

  // Get local projects
  if (user.projects?.length)
    workspaces.push({
      id: 'shared',
      name: 'Shared projects',
      owners: [],
      users: [],
      groups: [],
      projects: user.projects,
      archivedprojects: []
    })

  // Get organizations workspaces & projects
  const { groupsWorkspaces, groupsProjects } = await getOrganizationsData(
    { id },
    organizations
  )

  // Make unique
  const uniqueGroupWorkspaces = groupsWorkspaces.filter(
    (value, index, self) => self.findIndex((s) => s.id === value.id) === index
  )
  const uniqueGroupProjects = groupsProjects.filter(
    (value, index, self) => self.findIndex((s) => s.id === value.id) === index
  )

  workspaces.push(...uniqueGroupWorkspaces)
  workspaces.push(...uniqueGroupProjects)

  return workspaces
}

/**
 * Add to group
 * @param group Group
 * @param workspace Workspace
 */
const addToGroup = async (group: { id: string }, workspace: { id: string }) => {
  const groupData = await Group.get(group.id, ['workspaces'])
  if (!groupData) return

  if (!groupData.workspaces.includes(workspace.id))
    await Group.update({ id: group.id }, [
      {
        key: 'workspaces',
        type: 'array',
        method: 'append',
        value: workspace.id
      }
    ])
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
 * Add to user
 * @param user User
 * @param workspace Workspace
 */
const addToUser = async (
  user: { id: string },
  workspace: { id: string }
): Promise<void> => {
  const userData = await User.get(user.id, ['workspaces'])
  if (!userData) return

  if (!userData.workspaces.includes(workspace.id))
    await User.update({ id: user.id }, [
      {
        key: 'workspaces',
        type: 'array',
        method: 'append',
        value: workspace.id
      }
    ])
}

/**
 * Delete from user
 * @param user User
 * @param workspace Workspace
 */
const deleteFromUser = async (
  user: { id: string },
  workspace: { id: string }
) => {
  await User.update({ id: user.id }, [
    {
      key: 'workspaces',
      type: 'array',
      method: 'remove',
      value: workspace.id
    }
  ])
}

/**
 * Group update
 * @param workspace Workspace
 * @param toUpdate Groups to update
 */
const groupUpdate = async (
  workspace: { id: string },
  toUpdate: { value: string[] }
): Promise<void> => {
  // Get data
  const workspaceData = await getWithData(workspace.id, ['groups'])

  if (!workspaceData) return

  // Deleted groups
  const deleted = workspaceData.groups.filter(
    (group) => !toUpdate.value.includes(group.id)
  )

  for (const group of deleted) await deleteFromGroup(group, workspace)

  // Added groups
  const added: string[] = toUpdate.value.filter(
    (group: string) => !workspaceData.groups.find((g) => g.id === group)
  )

  for (const group of added) await addToGroup({ id: group }, workspace)
}

/**
 * User update
 * @param workspace Workspace
 * @param toUpdate Users to udpate
 */
const userUpdate = async (
  workspace: { id: string },
  toUpdate: { value: string[] }
): Promise<void> => {
  // Get data
  const workspaceData = await getWithData(workspace.id, ['users'])

  if (!workspaceData) return

  // Deleted users
  const deleted = workspaceData.users.filter(
    (user) => !toUpdate.value.includes(user.id)
  )

  for (const user of deleted) await deleteFromUser(user, workspace)

  // Added users
  const added: string[] = toUpdate.value.filter(
    (user: string) => !workspaceData.users.find((u) => u.id === user)
  )

  for (const user of added) await addToUser({ id: user }, workspace)
}

/**
 * Update
 * @param workspace Workspace
 * @param data Data
 */
const update = async (
  workspace: { id: string },
  data: IDataBaseEntry[]
): Promise<void> => {
  // Check groups
  const groupsUpdate = data.find((d) => d.key === 'groups' && !d.type)
  if (groupsUpdate) await groupUpdate(workspace, groupsUpdate)

  // Check users
  const usersUpdate = data.find((d) => d.key === 'users' && !d.type)
  if (usersUpdate) await userUpdate(workspace, usersUpdate)

  // Check name
  const nameUpdate = data.find((d) => d.key === 'name')
  if (nameUpdate) {
    nameUpdate.value = nameUpdate.value.substring(0, LIMIT50).trim()
  }

  // Update workspace
  await WorkspaceDB.update(workspace, data)
}

/**
 * Delete
 * @param user User
 * @param workspace Workspace
 */
const del = async (
  user: { id: string },
  workspace: { id: string }
): Promise<void> => {
  // Get data
  const data = await getWithData(workspace.id, ['groups', 'projects'])

  if (data) {
    // Delete from groups
    for (const group of data.groups) await deleteFromGroup(group, workspace)

    // Delete projects
    for (const project of data.projects)
      await Project.del(workspace, { id: project })
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
