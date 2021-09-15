/** @module lib/plugins */

import { promises as fs } from 'fs'

const plugins = []
const load = async () => {
  plugins.length = 0
  try {
    // Available directories
    const availables = await fs.readdir('plugins')

    await Promise.all(
      availables.map(async (available) => {
        try {
          // Import
          const plugin = await import(`/plugins/${available}`)
          plugins.push(plugin.default)
        } catch (err) {
          console.error(`Plugin ${plugin} not loaded!`)
        }
      })
    )
  } catch (err) {
    console.error(err)
  }
}

load()

const serverList = async () => {
  console.log(plugins)
  return plugins.map((plugin) => ({
    category: plugin.category,
    key: plugin.key,
    ...plugin.server
  }))
}

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

export default { clientList, serverList }
