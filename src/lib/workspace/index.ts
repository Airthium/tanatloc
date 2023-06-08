/** @module Lib.Workspace */

import { IDataBaseEntry } from '@/database/index.d'
import { IGroupWithData, IWorkspaceGet, IWorkspaceWithData } from '../index.d'

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
): Promise<IWorkspaceGet<T>> => {
  const workspaceData = await WorkspaceDB.get(id, data)

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
 * Get with data
 * @param id Id
 * @param data Data
 * @returns Workspace
 */
const getWithData = async <T extends TWorkspaceGet>(
  id: string,
  data: T
): Promise<IWorkspaceWithData<T>> => {
  const workspace = await get(id, data)

  const { owners, users, groups, ...workspaceData } = workspace

  // Get owners
  let ownersData
  if (owners) {
    ownersData = await Promise.all(
      owners.map(async (owner) => {
        const ownerData = await User.getWithData(owner, [
          'lastname',
          'firstname',
          'email',
          'avatar'
        ])
        return {
          ...ownerData,
          id: owner
        }
      })
    )
  }

  // Get users
  let usersData
  if (users) {
    usersData = await Promise.all(
      users.map(async (user) => {
        const userData = await User.getWithData(user, [
          'lastname',
          'firstname',
          'email',
          'avatar'
        ])
        return {
          ...userData,
          id: user
        }
      })
    )
  }

  // Get groups
  let groupsData
  if (groups) {
    groupsData = await Promise.all(
      groups.map(async (group) => {
        const groupData = await Group.getWithData(group, ['name'])
        return {
          ...groupData,
          id: group
        }
      })
    )
  }

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
  return Promise.all(
    workspaces.map(async (workspace) => {
      const data = await getWithData(workspace, [
        'name',
        'owners',
        'users',
        'groups',
        'projects'
      ])
      return {
        ...data,
        id: workspace
      }
    })
  )
}

/**
 * Get by user
 * @param user User
 * @returns Workspaces
 */
const getByUser = async ({ id }: { id: string }): Promise<TWorkspace[]> => {
  // Get workspaces'ids
  const user = await User.get(id, ['projects', 'workspaces'])
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
  const groupsWorkspaces: TWorkspace[] = []
  const groupsProjects: TWorkspace[] = []
  await Promise.all(
    organizations.map(async (organization) => {
      await Promise.all(
        organization.groups.map(async (group) => {
          const groupData = await Group.get(group.id, [
            'name',
            'users',
            'workspaces',
            'projects'
          ])

          if (!groupData.users.find((u) => u === id)) return

          // Workspaces
          if (groupData.workspaces.length) {
            const groupWorkspaces = await getWorkspaces(groupData.workspaces)

            groupsWorkspaces.push(
              ...groupWorkspaces.filter(
                (w) => !w.owners.find((o) => o.id === id)
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
        })
      )
    })
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
  if (groupsUpdate) {
    // Get data
    const workspaceData = await getWithData(workspace.id, ['groups'])

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
    const added: string[] = groupsUpdate.value.filter(
      (group: string) => !workspaceData.groups.find((g) => g.id === group)
    )
    await Promise.all(
      added.map(async (group) => {
        await addToGroup({ id: group }, workspace)
      })
    )
  }

  // Check users
  const usersUpdate = data.find((d) => d.key === 'users' && !d.type)
  if (usersUpdate) {
    // Get data
    const workspaceData = await getWithData(workspace.id, ['users'])

    // Deleted users
    const deleted = workspaceData.users.filter(
      (u) => !usersUpdate.value.includes(u.id)
    )

    await Promise.all(
      deleted.map(async (user) => {
        await deleteFromUser(user, workspace)
      })
    )

    // Added users
    const added: string[] = usersUpdate.value.filter(
      (user: string) => !workspaceData.users.find((u) => u.id === user)
    )
    await Promise.all(
      added.map(async (user) => {
        await addToUser({ id: user }, workspace)
      })
    )
  }

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

  // Delete from groups
  await Promise.all(
    data.groups.map(async (group) => {
      await deleteFromGroup(group, workspace)
    })
  )

  // Delete projects
  await Promise.all(
    data.projects.map(async (project) => {
      await Project.del(workspace, { id: project })
    })
  )

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
