/** @module Lib.Plugin */

import { merge } from 'lodash'
import { v4 as uuid } from 'uuid'

import { LIMIT50 } from '@/config/string'

import { HPCClientPlugin, HPCServerPlugin } from '@/plugins/index.d'

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
  plugin: HPCClientPlugin
): Promise<void> => {
  // Set uuid
  plugin.uuid = uuid()

  // Check name
  if (plugin.configuration?.name?.value) {
    const name = plugin.configuration.name.value as string
    plugin.configuration.name.value = name.substring(0, LIMIT50)
  }

  // Plugin initialization
  if (plugin.haveInit) {
    const plugins = await Plugins.serverList()
    const HPCPlugins = plugins.filter(
      (p) => p.category === 'HPC'
    ) as HPCServerPlugin[]
    const lib = HPCPlugins.find((l) => l.key === plugin.key)?.lib
    if (lib) {
      const init = await lib.init!(plugin.configuration)
      merge(plugin, init)
    }
  }

  // Encrypt
  for (const key in plugin.configuration) {
    const config = plugin.configuration[key]
    if (config.secret && config.value)
      plugin.configuration[key].value = JSON.stringify(
        await Tools.encrypt(config.value.toString())
      )
  }

  // Get
  const userData = await User.get(user.id, ['plugins'])
  if (!userData) return

  // Update user
  userData.plugins = [...(userData.plugins ?? []), plugin]

  // Update
  await User.update(user, [{ key: 'plugins', value: userData.plugins }])
}

/**
 * Extra
 * @param simulation Simulation
 * @param plugin Plugin
 * @param extra Extra action
 */
const extra = async (
  simulation: { id: string },
  plugin: HPCClientPlugin,
  extra: string
): Promise<void> => {
  const plugins = await Plugins.serverList()
  const HPCPlugins = plugins.filter(
    (p) => p.category === 'HPC'
  ) as HPCServerPlugin[]
  const lib = HPCPlugins.find((l) => l.key === plugin.key)?.lib
  if (lib) {
    await lib.extra?.(simulation, plugin.configuration, extra)
  }
}

/**
 * Get by user
 * @param user User
 * @returns Plugins
 */
const getByUser = async (user: { id: string }): Promise<HPCClientPlugin[]> => {
  // Get plugins
  const userData = await User.get(user.id, ['plugins'])

  return userData?.plugins ?? []
}

/**
 * Update
 * @param user User
 * @param plugin Plugin
 */
const update = async (
  user: { id: string },
  plugin: HPCClientPlugin
): Promise<void> => {
  // Check name
  if (plugin.configuration?.name?.value) {
    const name = plugin.configuration.name.value as string
    plugin.configuration.name.value = name.substring(0, LIMIT50)
  }

  // Get
  const userData = await User.get(user.id, ['plugins'])
  if (!userData) return

  if (!userData.plugins) return

  const index = userData.plugins.findIndex((p) => p.uuid === plugin.uuid)
  if (index === -1) return

  // Re-init
  if (plugin.haveInit && plugin.needReInit) {
    const plugins = await Plugins.serverList()
    const HPCPlugins = plugins.filter(
      (p) => p.category === 'HPC'
    ) as HPCServerPlugin[]
    const lib = HPCPlugins.find((l) => l.key === plugin.key)?.lib
    if (lib) {
      const init = await lib.init!(plugin.configuration)
      merge(plugin, init)
    }
    plugin.needReInit = false
  }

  // Encrypt
  for (const userPlugin of userData.plugins) {
    for (const key in userPlugin.configuration) {
      const config = userPlugin.configuration[key]
      if (config.secret && config.value)
        userPlugin.configuration[key].value = JSON.stringify(
          await Tools.encrypt(config.value)
        )
    }
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
 * @param user User
 * @param plugin Plugin
 */
const del = async (
  user: { id: string },
  plugin: HPCClientPlugin
): Promise<void> => {
  // Get
  const userData = await User.get(user.id, ['plugins'])
  if (!userData) return

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

const Plugin = { add, extra, getByUser, update, del }
export default Plugin
