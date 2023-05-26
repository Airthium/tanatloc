/** @module Lib.User */

import { IDataBaseEntry } from '@/database/index.d'
import { TUserGetKey } from '@/database/user/get'
import { IUserGet, IUserModelGet, IUserWithData } from '../index.d'
import { IClientPlugin } from '@/plugins/index.d'

import { LIMIT } from '@/config/string'

import UserDB, { INewUser, IUser, IUserCheck, TUserGet } from '@/database/user'

import Avatar from '../avatar'
import Organization from '../organization'
import Workspace from '../workspace'
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
  user.email = user.email.substring(0, LIMIT).trim()

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
): Promise<IUserGet<T>> => {
  const userData = await UserDB.get(id, data)

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
    userData.plugins = await decrypt(userData.plugins)
  } else {
    userData.plugins = []
  }
}

/**
 * Decrypt
 * @param plugins Plugins
 * @returns Decrypted plugins
 */
const decrypt = async (plugins: IClientPlugin[]): Promise<IClientPlugin[]> => {
  return Promise.all(
    plugins.map(async (plugin) => {
      for (const key in plugin.configuration) {
        const config = plugin.configuration[key]
        if (config.secret && config.value) {
          try {
            const valueJSON = JSON.parse(config.value)
            plugin.configuration[key].value = await Tools.decrypt(valueJSON)
          } catch (err) {
            plugin.configuration[key].value = config.value
          }
        }
      }
      return plugin
    })
  )
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
): Promise<IUserWithData<T>> => {
  const user = await get(id, data)

  const { avatar, usermodels, ...userData } = user

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

  // Get user models
  const userModels: IUserModelGet<
    ('model' | 'template' | 'owners' | 'users' | 'groups')[]
  >[] = []
  if (usermodels) {
    await Promise.all(
      usermodels.map(async (usermodel) => {
        const usermodelData = await UserModel.get(usermodel, [
          'model',
          'template',
          'owners',
          'users',
          'groups'
        ])
        userModels.push(usermodelData)
      })
    )
  }

  // Return
  return {
    ...userData,
    avatar: avatarData,
    usermodels: userModels
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
): Promise<IUser<T, TUserGetKey>> => {
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
    emailData.value = emailData.value.substring(0, LIMIT).trim()

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

  // Delete from organization
  await Promise.all(
    data.organizations.map(async (organization) => {
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

      // Delete from groups
      await Promise.all(
        organizationData.groups.map(async (group) => {
          await Group.update({ id: group }, [
            {
              key: 'users',
              type: 'array',
              method: 'remove',
              value: user.id
            }
          ])
        })
      )
    })
  )

  // Delete workspaces
  await Promise.all(
    data.workspaces.map(async (workspace) => {
      await Workspace.del(user, { id: workspace })
    })
  )

  // Delete usermodels
  await Promise.all(
    data.usermodels.map(async (usermodel) => {
      await UserModel.del({ id: usermodel })
    })
  )

  // Delete avatar
  if (data.avatar) {
    await Avatar.del(user, 'user', data.avatar)
  }

  // Delete user
  await UserDB.del(user)
}

const User = { login, add, get, getWithData, getBy, getAll, update, del }
export default User
