import merge from 'lodash.merge'

import User from './user'

import APIs from '@/plugins/api'

/**
 * Add plugin
 * @param {Object} user User { id }
 * @param {Object} plugin Plugin
 */
const add = async ({ id }, plugin) => {
  // Get
  const user = await User.get(id, ['plugins'])

  if (!user.plugins) user.plugins = []
  user.plugins = [...user.plugins, plugin]

  // Plugin initialization
  if (plugin.needInit) {
    const API = APIs[plugin.key]
    if (API) {
      const init = await API.init(plugin.configuration)
      merge(plugin, init)
    }
  }

  // Update
  await User.update({ id }, [{ key: 'plugins', value: user.plugins }])
}

/**
 * Get by user
 * @param {string} user User { id }
 */
const getByUser = async ({ id }) => {
  // Get plugins
  const user = await User.get(id, ['plugins'])

  return user.plugins || []
}

/**
 * Update
 * @param {User} user User { id }
 * @param {Object} plugin Plugin
 */
const update = async ({ id }, plugin) => {
  // Get
  const user = await User.get(id, ['plugins'])

  if (!user.plugins) return

  const index = user.plugins.findIndex((p) => p.uuid === plugin.uuid)
  if (index === -1) return

  user.plugins = [
    ...user.plugins.slice(0, index),
    plugin,
    ...user.plugins.slice(index + 1)
  ]

  // Re-init
  if (plugin.needInit && plugin.needReInit) {
    const API = APIs[plugin.key]
    if (API) {
      const init = await API.init(plugin.configuration)
      merge(plugin, init)
    }
    plugin.needReInit = false
  }

  // Update
  await User.update({ id }, [{ key: 'plugins', value: user.plugins }])
}

/**
 *
 * @param {Object} user User { id }
 * @param {Object} plugin Plugin { uuid }
 */
const del = async ({ id }, plugin) => {
  // Get
  const user = await User.get(id, ['plugins'])
  if (!user.plugins) return

  const index = user.plugins.findIndex((p) => p.uuid === plugin.uuid)
  if (index === -1) return

  user.plugins = [
    ...user.plugins.slice(0, index),
    ...user.plugins.slice(index + 1)
  ]

  // Update
  await User.update({ id }, [{ key: 'plugins', value: user.plugins }])
}

export default { add, getByUser, update, del }
