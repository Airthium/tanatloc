/** @module lib/plugins */

import loadPlugins from '@/plugins'

let plugins
const load = async () => {
  plugins = await loadPlugins()
}

load().catch(console.error)

const clientList = async (user) => {
  return plugins
    .map((plugin) => {
      if (user.authorizedplugins.includes(plugin.key))
        return {
          category: plugin.category,
          key: plugin.key,
          ...plugin.client
        }
    })
    .filter((p) => p)
}

const serverList = async () => {
  return plugins.map((plugin) => ({
    category: plugin.category,
    key: plugin.key,
    ...plugin.server
  }))
}

export default { clientList, serverList }
