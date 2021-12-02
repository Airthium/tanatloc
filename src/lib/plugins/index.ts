/** @module Lib.Plugins */

import isElectron from 'is-electron'

import { IClientPlugin, IServerPlugin } from '@/database/index.d'

import Simulation from '../simulation'
import Tools from '../tools'

const plugins = []

/**
 * Load
 * @memberof Lib.Plugins
 */
const load = async (): Promise<void> => {
  // Available directories
  const availables = await Tools.listDirectories(
    //@ts-ignore
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
    restartJobs().catch(() => {
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
const restartJobs = async (): Promise<void> => {
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
 * @returns List
 */
const serverList = (): IServerPlugin[] => {
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
 * @param user User
 * @param complete Complete or filtered by user.authorizedplugins
 * @returns List
 */
const clientList = (
  user: { authorizedplugins?: string[] },
  complete?: boolean
): IClientPlugin[] => {
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

const Plugins = { clientList, serverList }
export default Plugins
