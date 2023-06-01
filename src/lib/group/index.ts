/** @module Lib.Group */

import { IDataBaseEntry } from '@/database/index.d'
import {
  IGroupGet,
  IGroupWithData,
  IProjectWithData,
  IUserModelWithData,
  IUserWithData,
  IWorkspaceWithData
} from '../index.d'

import GroupDB, { IGroup, INewGroup, TGroupGet } from '@/database/group'

import User from '../user'
import Workspace from '../workspace'
import Project from '../project'
import Organization from '../organization'
import UserModel from '../userModel'

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
 * Check user
 * @param data Data
 */
const checkUsers = <T extends TGroupGet>(data: IGroup<T>): void => {
  if (!data.users) data.users = []
}

/**
 * Check workspaces
 * @param data Data
 */
const checkWorkspaces = <T extends TGroupGet>(data: IGroup<T>): void => {
  if (!data.workspaces) data.workspaces = []
}

/**
 * Check projects
 * @param data Data
 */
const checkProjects = <T extends TGroupGet>(data: IGroup<T>): void => {
  if (!data.projects) data.projects = []
}

/**
 * Check user models
 * @param data Data
 */
const checkUserModels = <T extends TGroupGet>(data: IGroup<T>): void => {
  if (!data.usermodels) data.usermodels = []
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

  if (data.includes('users')) checkUsers(groupData)

  if (data.includes('workspaces')) checkWorkspaces(groupData)

  if (data.includes('projects')) checkProjects(groupData)

  if (data.includes('usermodels')) checkUserModels(groupData)

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
 * Get workspaces data
 * @param workspaces Workspaces
 * @returns Workspaces
 */
const getWorkspacesData = async (
  workspaces: string[]
): Promise<IWorkspaceWithData<'name'[]>[]> => {
  return Promise.all(
    workspaces.map(async (workspace) => {
      const workspaceData = await Workspace.getWithData(workspace, ['name'])

      return {
        ...workspaceData,
        id: workspace
      }
    })
  )
}

/**
 * Get projects data
 * @param projects Projects
 * @returns Projects
 */
const getProjectsData = async (
  projects: string[]
): Promise<IProjectWithData<'title'[]>[]> => {
  return Promise.all(
    projects.map(async (project) => {
      const projectData = await Project.getWithData(project, ['title'])

      return {
        ...projectData,
        id: project
      }
    })
  )
}

/**
 * Get usermodels data
 * @param usermodels User models
 * @returns Usermodels
 */
const getUsermodelsData = async (
  usermodels: string[]
): Promise<IUserModelWithData<'model'[]>[]> => {
  return Promise.all(
    usermodels.map(async (usermodel) => {
      const usermodelData = await UserModel.getWithData(usermodel, ['model'])
      return {
        ...usermodelData,
        id: usermodel
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

  const { users, workspaces, projects, usermodels, ...groupData } = group

  // Get users
  let usersData
  if (users) usersData = await getUsersData(users)

  // Get workspaces
  let workspacesData
  if (workspaces) workspacesData = await getWorkspacesData(workspaces)

  // Get projects
  let projectsData
  if (projects) projectsData = await getProjectsData(projects)

  // Get workspaces
  let usermodelsData
  if (usermodels) usermodelsData = await getUsermodelsData(usermodels)

  return {
    ...groupData,
    users: usersData,
    workspaces: workspacesData,
    projects: projectsData,
    usermodels: usermodelsData
  } as IGroupWithData<T>
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

  if (data.includes('users')) groups.forEach((group) => checkUsers(group))

  if (data.includes('workspaces'))
    groups.forEach((group) => checkWorkspaces(group))

  if (data.includes('projects')) groups.forEach((group) => checkProjects(group))

  if (data.includes('usermodels'))
    groups.forEach((group) => checkUserModels(group))

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
    'organization',
    'usermodels'
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

  // Delete group from usermodels
  groupData.usermodels &&
    (await Promise.all(
      groupData.usermodels.map(async (usermodel) => {
        await UserModel.update({ id: usermodel }, [
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
