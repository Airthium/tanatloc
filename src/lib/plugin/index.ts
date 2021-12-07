/** @module Lib.Plugin */

import merge from 'lodash.merge'
import { v4 as uuid } from 'uuid'

import { IClientPlugin } from '@/database/index.d'

import User from '../user'
import Plugins from '../plugins'

/**
 * Add
 * @memberof Lib.Plugin
 * @param user User
 * @param plugin Plugin
 */
const add = async (
  user: { id: string },
  plugin: IClientPlugin
): Promise<void> => {
  // Set uuid
  plugin.uuid = uuid()

  // Get
  const userData = await User.get(user.id, ['plugins'])

  // Update user
  userData.plugins = [...(userData.plugins || []), plugin]

  // Plugin initialization
  if (plugin.needInit) {
    const plugins = Plugins.serverList()
    const lib = plugins.find((l) => l.key === plugin.key)?.lib
    if (lib) {
      const init = await lib.init(plugin.configuration)
      merge(plugin, init)
    }
  }

  // Update
  await User.update(user, [{ key: 'plugins', value: userData.plugins }])
}

/**
 * Get by user
 * @memberof Lib.Plugin
 * @param user User
 * @returns Plugins
 */
const getByUser = async (user: { id: string }): Promise<IClientPlugin[]> => {
  // Get plugins
  const userData = await User.get(user.id, ['plugins'])

  return userData.plugins || []
}

/**
 * Update
 * @memberof Lib.Plugin
 * @param user User
 * @param plugin Plugin
 */
const update = async (
  user: { id: string },
  plugin: IClientPlugin
): Promise<void> => {
  // Get
  const userData = await User.get(user.id, ['plugins'])

  if (!userData.plugins) return

  const index = userData.plugins.findIndex((p) => p.uuid === plugin.uuid)
  if (index === -1) return

  // Re-init
  if (plugin.needInit && plugin.needReInit) {
    const plugins = Plugins.serverList()
    const lib = plugins.find((l) => l.key === plugin.key)?.lib
    if (lib) {
      const init = await lib.init(plugin.configuration)
      merge(plugin, init)
    }
    plugin.needReInit = false
  }

  userData.plugins = [
    ...userData.plugins.slice(0, index),
    { ...userData.plugins[index], ...plugin },
    ...userData.plugins.slice(index + 1)
  ]

  // Update
  await User.update(user, [{ key: 'plugins', value: userData.plugins }])
}

/**
 * Delete
 * @memberof Lib.Plugin
 * @param user User
 * @param plugin Plugin
 */
const del = async (
  user: { id: string },
  plugin: IClientPlugin
): Promise<void> => {
  // Get
  const userData = await User.get(user.id, ['plugins'])
  if (!userData.plugins) return

  const index = userData.plugins.findIndex((p) => p.uuid === plugin.uuid)
  if (index === -1) return

  userData.plugins = [
    ...userData.plugins.slice(0, index),
    ...userData.plugins.slice(index + 1)
  ]

  // Update
  await User.update(user, [{ key: 'plugins', value: userData.plugins }])
}

const Plugin = { add, getByUser, update, del }
export default Plugin