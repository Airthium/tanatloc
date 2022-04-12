/** @module Lib.Plugins */

import isElectron from 'is-electron'

import { IClientPlugin, IPlugin, IServerPlugin } from '@/database/index.d'

import Simulation from '../simulation'
import Tools from '../tools'

import init from 'src/init'

let plugins: IPlugin[]

/**
 * Load
 */
export const loadPlugins = async (): Promise<void> => {
  console.info('Load plugins...')

  // Available directories
  const availables = await Tools.listDirectories(
    isElectron() ? `${process.resourcesPath}/plugins` : './plugins'
  )

  plugins = await Promise.all(
    availables.map(async (available) => {
      try {
        // Import
        const plugin = isElectron()
          ? await require(`/plugins/${available}`)
          : await import(`/plugins/${available}`)
        console.info(` - Plugin ${available} loaded!`)
        return plugin.default
      } catch (err) {
        console.error(` - Plugin ${available} NOT loaded!`)
      }
    })
  )

  global.initialization = {
    ...(global.initialization || {}),
    plugins: true
  }
}

/**
 * Restart jobs
 */
export const restartJobs = async (): Promise<void> => {
  console.info('Restart jobs...')
  const simulations = await Simulation.getAll(['id', 'scheme', 'tasks'])

  // Check waiting or processing tasks
  for (let simulation of simulations) {
    try {
      for (let task of simulation.tasks || []) {
        if (task?.status === 'wait' || task?.status === 'process') {
          console.info(' - Restart simulation ' + simulation.id)
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
      console.warn(' ⚠ Simulation ' + simulation.id + ' restart failed!')
    }
  }
}

init()

/**
 * Server list
 * @returns List
 */
const serverList = async (): Promise<IServerPlugin[]> => {
  // Check
  while (!plugins) await new Promise((resolve) => setTimeout(resolve, 10))

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
 * @param user User
 * @param complete Complete or filtered by user.authorizedplugins
 * @returns List
 */
const clientList = async (
  user: { authorizedplugins?: string[] },
  complete?: boolean
): Promise<IClientPlugin[]> => {
  // Check
  while (!plugins) await new Promise((resolve) => setTimeout(resolve, 10))

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
