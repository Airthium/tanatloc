/** @module Lib.Group */

import { IDataBaseEntry } from '@/database/index.d'
import { IGroupGet, IGroupWithData, IUserWithData } from '../index.d'

import GroupDB, { INewGroup, TGroupGet } from '@/database/group'

import User from '../user'
import Workspace from '../workspace'
import Project from '../project'
import Organization from '../organization'

/**
 * Add
 * @param organization Organization
 * @param group Group
 * @returns New group
 */
const add = async (
  organization: { id: string },
  group: { name: string; users: string[] }
): Promise<INewGroup> => {
  // Add group
  const newGroup = await GroupDB.add(organization, group)

  // Add group to organization
  await Organization.update(organization, [
    {
      key: 'groups',
      type: 'array',
      method: 'append',
      value: newGroup.id
    }
  ])

  return newGroup
}

/**
 * Get
 * @param id Id
 * @param data Data
 * @returns Group
 */
const get = async <T extends TGroupGet>(
  id: string,
  data: T
): Promise<IGroupGet<T>> => {
  const groupData = await GroupDB.get(id, data)

  if (data.includes('users') && !groupData.users) groupData.users = []

  if (data.includes('workspaces') && !groupData.workspaces)
    groupData.workspaces = []

  if (data.includes('projects') && !groupData.projects) groupData.projects = []

  return groupData as IGroupGet<T>
}

/**
 * Get users data
 * @param users Users
 * @returns Users
 */
const getUsersData = async (
  users: string[]
): Promise<
  IUserWithData<('firstname' | 'lastname' | 'email' | 'avatar')[]>[]
> => {
  return Promise.all(
    users.map(async (user) => {
      const userData = await User.getWithData(user, [
        'firstname',
        'lastname',
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

/**
 * Get with data
 * @param id Id
 * @param data Data
 * @returns Group
 */
const getWithData = async <T extends TGroupGet>(
  id: string,
  data: T
): Promise<IGroupWithData<T>> => {
  const group = await get(id, data)

  const { users, ...groupData } = group

  // Get users
  let usersData
  if (users) usersData = await getUsersData(users)

  return { ...groupData, users: usersData } as IGroupWithData<T>
}

/**
 * Get all
 * @param data Data
 * @return Groups
 */
const getAll = async <T extends TGroupGet>(
  data: T
): Promise<IGroupWithData<T>[]> => {
  // Get groups
  const groups = await GroupDB.getAll(data)

  if (data.includes('users'))
    groups.forEach((group) => {
      if (!group.users) group.users = []
    })

  if (data.includes('workspaces'))
    groups.forEach((group) => {
      if (!group.workspaces) group.workspaces = []
    })

  if (data.includes('projects'))
    groups.forEach((group) => {
      if (!group.projects) group.projects = []
    })

  const groupsData = groups.map((group) => {
    const { users, ...groupData } = group
    return { ...groupData, users: [] }
  })

  // Get users
  const usersData = await Promise.all(
    groups.map(async (group) => getUsersData(group.users))
  )

  // Return
  return groupsData.map((group, index) => ({
    ...group,
    users: usersData[index]
  })) as IGroupWithData<T>[]
}

/**
 * Get by organization
 * @param id Organization id
 * @param data Data
 * @returns Groups
 */
const getByOrganization = async <T extends TGroupGet>(
  id: string,
  data: T
): Promise<IGroupWithData<T>[]> => {
  // Get organization
  const organization = await Organization.get(id, ['groups'])

  // Get groups
  return Promise.all(
    organization.groups.map(async (group) => {
      const groupData = await getWithData(group, data)

      return {
        ...groupData,
        id: group
      }
    })
  )
}

/**
 * Update
 * @param group Group
 * @param data Data
 */
const update = async (
  group: { id: string },
  data: IDataBaseEntry[]
): Promise<void> => {
  await GroupDB.update(group, data)
}

/**
 * Delete
 * @param group Group
 */
const del = async (group: { id: string }): Promise<void> => {
  // Get data
  const groupData = await get(group.id, [
    'users',
    'workspaces',
    'projects',
    'organization'
  ])

  // Delete group from organization
  await Organization.update({ id: groupData.organization }, [
    {
      key: 'groups',
      type: 'array',
      method: 'remove',
      value: group.id
    }
  ])

  // Delete group from workspaces
  groupData.workspaces &&
    (await Promise.all(
      groupData.workspaces.map(async (workspace) => {
        await Workspace.update({ id: workspace }, [
          {
            key: 'groups',
            type: 'array',
            method: 'remove',
            value: group.id
          }
        ])
      })
    ))

  // Delete group from projects
  groupData.projects &&
    (await Promise.all(
      groupData.projects.map(async (project) => {
        await Project.update({ id: project }, [
          {
            key: 'groups',
            type: 'array',
            method: 'remove',
            value: group.id
          }
        ])
      })
    ))

  // Delete group
  await GroupDB.del(group)
}

const Group = { add, get, getWithData, getAll, getByOrganization, update, del }
export default Group
