/** @module lib/plugins */

import { promises as fs } from 'fs'
import isElectron from 'is-electron'

const plugins = []
const load = async () => {
  // Available directories
  const availables = await fs.readdir(
    isElectron() ? `${process.resourcesPath}/plugins` : './plugins'
  )

  await Promise.all(
    availables.map(async (available) => {
      try {
        // Import
        const plugin = isElectron()
          ? await require(`/plugins/${available}`)
          : await import(`/plugins/${available}`)
        plugins.push(plugin.default)
        console.info(`Plugin ${available} loaded!`)
      } catch (err) {
        console.error(`Plugin ${available} NOT loaded!`)
      }
    })
  )
}

load().catch(() => {
  console.error('Plugins load failed!')
})

const serverList = async () => {
  return plugins.map((plugin) => {
    return {
      category: plugin.category,
      key: plugin.key,
      ...plugin.server
    }
  })
}

const clientList = async (user, complete) => {
  if (complete) {
    return plugins.map((plugin) => ({
      category: plugin.category,
      key: plugin.key,
      ...plugin.client
    }))
  } else {
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
}

export default { clientList, serverList }
