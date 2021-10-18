/** @namespace Lib.Plugins */

import isElectron from 'is-electron'

import Simulation from '../simulation'
import Tools from '../tools'

const plugins = []

/**
 * Load
 * @memberof Lib.Plugins
 */
const load = async () => {
  // Available directories
  const availables = await Tools.listDirectories(
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

load()
  .then(() => {
    restartJobs.apply().catch(() => {
      console.error('Restart jobs failed!')
    })
  })
  .catch(() => {
    console.error('Plugins load failed!')
  })

/**
 * Restart jobs
 * @memberof Lib.Plugins
 */
const restartJobs = async () => {
  const simulations = await Simulation.getAll(['id', 'scheme', 'tasks'])

  // Check waiting or processing tasks
  for (let simulation of simulations) {
    try {
      for (let task of simulation.tasks || []) {
        if (task?.status === 'wait' || task?.status === 'process') {
          console.info('Restart simulation ' + simulation.id)
          const pluginKey = task.plugin
          const plugin = plugins.find((p) => p.key === pluginKey)
          if (plugin && plugin.server.lib.monitoring) {
            const cloudConfiguration =
              simulation.scheme.configuration.run.cloudServer.configuration
            await plugin.server.lib.monitoring(
              simulation.id,
              task.pid,
              simulation.tasks,
              task,
              cloudConfiguration
            )
          }
        }
      }
    } catch (err) {
      console.warn('Simulation ' + simulation.id + ' restart failed!')
    }
  }
}

/**
 * Server list
 * @memberof Lib.Plugins
 * @returns {Array} List
 */
const serverList = () => {
  return plugins.map((plugin) => {
    return {
      category: plugin.category,
      key: plugin.key,
      ...plugin.server
    }
  })
}

/**
 * Client list
 * @memberof Lib.Plugins
 * @param {Object} user User `{ authorizedplugins }`
 * @param {boolean} [complete] Complete or filtered by user.authorizedplugins
 * @returns {Array} List
 */
const clientList = (user, complete) => {
  if (complete) {
    return plugins.map((plugin) => ({
      category: plugin.category,
      key: plugin.key,
      ...plugin.client
    }))
  } else {
    return plugins
      .map((plugin) => {
        if (user.authorizedplugins?.includes(plugin.key))
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
