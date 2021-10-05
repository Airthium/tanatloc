/** @namespace Lib.Plugin */

import merge from 'lodash.merge'
import { v4 as uuid } from 'uuid'

import User from '../user'
import Plugins from '../plugins'

/**
 * Add
 * @memberof Lib.Plugin
 * @param {Object} user User `{ id }`
 * @param {Object} plugin Plugin
 */
const add = async ({ id }, plugin) => {
  // Set uuid
  plugin.uuid = uuid()

  // Get
  const user = await User.get(id, ['plugins'])

  // Update user
  user.plugins = [...(user.plugins || []), plugin]

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
  await User.update({ id }, [{ key: 'plugins', value: user.plugins }])
}

/**
 * Get by user
 * @memberof Lib.Plugin
 * @param {string} user User `{ id }`
 * @returns {Array} Plugins
 */
const getByUser = async ({ id }) => {
  // Get plugins
  const user = await User.get(id, ['plugins'])

  return user.plugins || []
}

/**
 * Update
 * @memberof Lib.Plugin
 * @param {User} user User `{ id }`
 * @param {Object} plugin Plugin
 */
const update = async ({ id }, plugin) => {
  // Get
  const user = await User.get(id, ['plugins'])

  if (!user.plugins) return

  const index = user.plugins.findIndex((p) => p.uuid === plugin.uuid)
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

  user.plugins = [
    ...user.plugins.slice(0, index),
    { ...user.plugins[index], ...plugin },
    ...user.plugins.slice(index + 1)
  ]

  // Update
  await User.update({ id }, [{ key: 'plugins', value: user.plugins }])
}

/**
 * Delete
 * @memberof Lib.Plugin
 * @param {Object} user User `{ id }`
 * @param {Object} plugin Plugin `{ uuid }`
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

const Plugin = { add, getByUser, update, del }
export default Plugin
