/** @module Lib.Plugin */

import { merge } from 'lodash'
import { v4 as uuid } from 'uuid'

import { LIMIT50 } from '@/config/string'

import { IClientPlugin } from '@/plugins/index.d'

import User from '../user'
import Plugins from '../plugins'
import Tools from '../tools'

/**
 * Add
 * @param user User
 * @param plugin Plugin
 */
const add = async (
  user: { id: string },
  plugin: IClientPlugin
): Promise<void> => {
  // Set uuid
  plugin.uuid = uuid()

  // Check name
  if (plugin.configuration?.name?.value)
    plugin.configuration.name.value = plugin.configuration.name.value.substring(
      0,
      LIMIT50
    )

  // Plugin initialization
  if (plugin.haveInit) {
    const plugins = await Plugins.serverList()
    const lib = plugins.find((l) => l.key === plugin.key)?.lib
    if (lib) {
      const init = await lib.init(plugin.configuration)
      merge(plugin, init)
    }
  }

  // Encrypt
  for (const key in plugin.configuration) {
    const config = plugin.configuration[key]
    if (config.secret && config.value)
      plugin.configuration[key].value = JSON.stringify(
        await Tools.encrypt(config.value)
      )
  }

  // Get
  const userData = await User.get(user.id, ['plugins'])

  // Update user
  userData.plugins = [...(userData.plugins ?? []), plugin]

  // Update
  await User.update(user, [{ key: 'plugins', value: userData.plugins }])
}

/**
 * Get by user
 * @param user User
 * @returns Plugins
 */
const getByUser = async (user: { id: string }): Promise<IClientPlugin[]> => {
  // Get plugins
  const userData = await User.get(user.id, ['plugins'])

  return userData.plugins ?? []
}

/**
 * Update
 * @param user User
 * @param plugin Plugin
 */
const update = async (
  user: { id: string },
  plugin: IClientPlugin
): Promise<void> => {
  // Check name
  if (plugin.configuration?.name?.value)
    plugin.configuration.name.value = plugin.configuration.name.value.substring(
      0,
      LIMIT50
    )

  // Get
  const userData = await User.get(user.id, ['plugins'])

  if (!userData.plugins) return

  const index = userData.plugins.findIndex((p) => p.uuid === plugin.uuid)
  if (index === -1) return

  // Re-init
  if (plugin.haveInit && plugin.needReInit) {
    const plugins = await Plugins.serverList()
    const lib = plugins.find((l) => l.key === plugin.key)?.lib
    if (lib) {
      const init = await lib.init(plugin.configuration)
      merge(plugin, init)
    }
    plugin.needReInit = false
  }

  // Encrypt
  userData.plugins = await Promise.all(
    userData.plugins.map(async (p) => {
      for (const key in p.configuration) {
        const config = p.configuration[key]
        if (config.secret && config.value)
          p.configuration[key].value = JSON.stringify(
            await Tools.encrypt(config.value)
          )
      }
      return p
    })
  )

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
