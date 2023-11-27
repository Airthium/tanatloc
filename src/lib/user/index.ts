/** @module Lib.User */

import { IDataBaseEntry } from '@/database/index.d'
import { TUserGetKey } from '@/database/user/get'
import {
  IProjectGet,
  IUserGet,
  IUserModelWithData,
  IUserWithData,
  IWorkspaceGet
} from '../index.d'
import { HPCClientPlugin } from '@/plugins/index.d'

import { LIMIT50 } from '@/config/string'

import UserDB, { INewUser, IUser, IUserCheck, TUserGet } from '@/database/user'

import Avatar from '../avatar'
import Organization from '../organization'
import Workspace from '../workspace'
import Project from '../project'
import Email from '../email'
import System from '../system'
import Group from '../group'
import Tools from '../tools'
import UserModel from '../userModel'

/**
 * Add
 * @param user User
 * @returns New user
 */
const add = async (user: {
  email: string
  password: string
}): Promise<INewUser> => {
  // Check email
  user.email = user.email.substring(0, LIMIT50).trim()

  // Add
  const newUser = await UserDB.add(user)
  if (!newUser.alreadyExists) {
    // Send email
    await Email.subscribe(user.email, newUser.id!)
  }

  const system = await System.get(['defaultplugins'])
  if (system.defaultplugins) {
    await UserDB.update({ id: newUser.id! }, [
      {
        key: 'authorizedplugins',
        value: system.defaultplugins
      }
    ])
  }

  return newUser
}

/**
 * Get
 * @param id User id
 * @param data Data
 * @returns User
 */
const get = async <T extends TUserGet>(
  id: string,
  data: T
): Promise<IUserGet<T> | undefined> => {
  const userData = await UserDB.get(id, data)
  if (!userData) return

  if (data.includes('organizations') && !userData.organizations)
    userData.organizations = []

  if (data.includes('projects') && !userData.projects) userData.projects = []

  if (data.includes('workspaces') && !userData.workspaces)
    userData.workspaces = []

  if (data.includes('authorizedplugins') && !userData.authorizedplugins)
    userData.authorizedplugins = []

  if (data.includes('plugins')) await setPluginsData(userData)

  if (data.includes('usermodels') && !userData.usermodels)
    userData.usermodels = []

  return userData as IUserGet<T>
}

/**
 * Set plugins data
 * @param userData User data
 */
const setPluginsData = async (
  userData: Partial<IUser<TUserGet>>
): Promise<void> => {
  if (userData.plugins) {
    userData.plugins = await decrypt(userData.plugins as HPCClientPlugin[])
  } else {
    userData.plugins = []
  }
}

/**
 * Decrypt
 * @param plugins Plugins
 * @returns Decrypted plugins
 */
const decrypt = async (
  plugins: HPCClientPlugin[]
): Promise<HPCClientPlugin[]> => {
  const pluginsData = []
  for (const plugin of plugins) {
    for (const key in plugin.configuration) {
      const config = plugin.configuration[key]
      if (config.secret && config.value) {
        try {
          const valueJSON = JSON.parse(config.value.toString())
          plugin.configuration[key].value = await Tools.decrypt(valueJSON)
        } catch (err) {
          plugin.configuration[key].value = config.value
        }
      }
    }
    pluginsData.push(plugin)
  }
  return pluginsData
}

/**
 * Get workspaces data
 * @param workspaces Workspaces
 * @returns Workspaces data
 */
const getWorkspacesData = async (
  workspaces: string[]
): Promise<IWorkspaceGet<'name'[]>[]> => {
  if (!workspaces) return []

  const workspacesData = []
  for (const workspace of workspaces) {
    const workspaceData = await Workspace.get(workspace, ['name'])
    if (!workspaceData) continue

    workspacesData.push(workspaceData)
  }

  return workspacesData
}

/**
 * Get projects data
 * @param projects Projects
 * @returns Projects data
 */
const getProjectsData = async (
  projects: string[]
): Promise<IProjectGet<'title'[]>[]> => {
  if (!projects) return []

  const projectsData = []
  for (const project of projects) {
    const projectData = await Project.get(project, ['title'])
    if (!projectData) continue

    projectsData.push(projectData)
  }
  return projectsData
}

/**
 * Get usermodels data
 * @param usermodels Usermodels
 * @returns Usermodels data
 */
const getUsermodelsData = async (
  usermodels: string[]
): Promise<
  IUserModelWithData<('owners' | 'users' | 'groups' | 'model' | 'template')[]>[]
> => {
  if (!usermodels) return []

  const usermodelsData = []
  for (const usermodel of usermodels) {
    const usermodelData = await UserModel.getWithData(usermodel, [
      'model',
      'template',
      'owners',
      'users',
      'groups'
    ])
    if (!usermodelData) continue

    usermodelsData.push(usermodelData)
  }
  return usermodelsData
}

/**
 * Get with data (avatar)
 * @param id User id
 * @param data Data
 * @returns User
 */
const getWithData = async <T extends TUserGet>(
  id: string,
  data: T
): Promise<IUserWithData<T> | undefined> => {
  const user = await get(id, data)
  if (!user) return

  const { avatar, workspaces, projects, usermodels, ...userData } = user

  // Get avatar
  let avatarData
  if (avatar) {
    try {
      avatarData = await Avatar.read(avatar)
    } catch (err) {
      console.warn(err)
      avatarData = undefined
    }
  }

  // Get workspaces data
  const workspacesData = await getWorkspacesData(workspaces)

  // Get projects data
  const projectsData = await getProjectsData(projects)

  // Get user models
  const usermodelsData = await getUsermodelsData(usermodels)

  // Return
  return {
    ...userData,
    avatar: avatarData,
    workspaces: workspacesData,
    projects: projectsData,
    usermodels: usermodelsData
  } as IUserWithData<T>
}

/**
 * Get by key
 * @param key key
 * @param data Data
 * @param keyName Key name
 * @returns User
 */
const getBy = async <T extends TUserGet, Key extends TUserGetKey>(
  key: string,
  data: T,
  keyName: Key
): Promise<IUser<T, TUserGetKey> | undefined> => {
  return UserDB.get(key, data, keyName)
}

/**
 * Get all
 * @param data Data
 * @returns Users
 */
const getAll = async <T extends TUserGet>(data: T): Promise<IUser<T>[]> => {
  const users = await UserDB.getAll(data)

  if (data.includes('organizations'))
    users.forEach((user) => {
      !user.organizations && (user.organizations = [])
    })

  if (data.includes('workspaces'))
    users.forEach((user) => {
      !user.workspaces && (user.workspaces = [])
    })

  if (data.includes('authorizedplugins'))
    users.forEach((user) => {
      !user.authorizedplugins && (user.authorizedplugins = [])
    })

  if (data.includes('plugins'))
    users.forEach((user) => {
      !user.plugins && (user.plugins = [])
    })

  if (data.includes('usermodels'))
    users.forEach((user) => {
      !user.usermodels && (user.usermodels = [])
    })

  return users
}

/**
 * Login
 * @param user User
 * @returns Logged user
 */
const login = async (user: {
  email: string
  password: string
}): Promise<null | (IUserCheck & { email: string })> => {
  const loggedUser = await UserDB.getByUsernameAndPassword(user)

  // Check user
  if (!loggedUser) return null

  // Return
  return {
    ...loggedUser,
    email: user.email
  }
}

/**
 * Update
 * @param user User
 * @param data Data
 */
const update = async (
  user: { id: string },
  data: IDataBaseEntry[]
): Promise<void> => {
  // Check email change
  const emailData = data.find((d) => d.key === 'email')
  if (emailData) {
    emailData.value = emailData.value.substring(0, LIMIT50).trim()

    // Revalidate email
    const valid = await Email.revalidate(emailData.value, user.id)

    if (valid)
      data.push({
        key: 'isvalidated',
        value: false
      })
  }

  await UserDB.update(user, data)
}

/**
 * Delete user
 * @param user User
 */
const del = async (user: { id: string }): Promise<void> => {
  // Get data
  const data = await get(user.id, [
    'workspaces',
    'usermodels',
    'organizations',
    'avatar'
  ])
  if (!data) return

  // Delete from organization
  for (const organization of data.organizations) {
    await Organization.update({ id: organization }, [
      {
        key: 'owners',
        type: 'array',
        method: 'remove',
        value: user.id
      }
    ])
    await Organization.update({ id: organization }, [
      {
        key: 'pendingowners',
        type: 'array',
        method: 'remove',
        value: user.id
      }
    ])
    await Organization.update({ id: organization }, [
      {
        key: 'users',
        type: 'array',
        method: 'remove',
        value: user.id
      }
    ])
    await Organization.update({ id: organization }, [
      {
        key: 'pendingusers',
        type: 'array',
        method: 'remove',
        value: user.id
      }
    ])

    const organizationData = await Organization.get(organization, ['groups'])
    if (!organizationData) continue

    // Delete from groups
    for (const group of organizationData.groups) {
      await Group.update({ id: group }, [
        {
          key: 'users',
          type: 'array',
          method: 'remove',
          value: user.id
        }
      ])
    }
  }

  // Delete workspaces
  for (const workspace of data.workspaces)
    await Workspace.del(user, { id: workspace })

  // Delete usermodels
  for (const usermodel of data.usermodels)
    await UserModel.del({ id: user.id }, { id: usermodel })

  // Delete avatar
  if (data.avatar) {
    await Avatar.del(user, 'user', data.avatar)
  }

  // Delete user
  await UserDB.del(user)
}

const User = { login, add, get, getWithData, getBy, getAll, update, del }
export default User
