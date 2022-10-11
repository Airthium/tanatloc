/** @module Lib.Plugins */

import isElectron from 'is-electron'

import { IClientPlugin, IPlugin, IServerPlugin } from '@/plugins/index.d'

import Simulation from '../simulation'
import Tools from '../tools'

/**
 * Load plugins
 * @return Plugins
 */
export const loadPlugins = async (): Promise<IPlugin[]> => {
  console.info('Load plugins...')

  // Available directories
  const availables = await Tools.listDirectories(
    isElectron()
      ? `${process.resourcesPath}/app/server/tanatloc/plugins`
      : './dist/plugins'
  )

  const plugins = await Promise.all(
    availables.map(async (available) => {
      try {
        // Import
        const plugin = isElectron()
          ? await require(`../../../plugins/${available}`)
          : await import(`../../../plugins/${available}`)
        console.info(` - Plugin ${available} loaded!`)
        return plugin.default
      } catch (err) {
        console.error(` - Plugin ${available} NOT loaded!`)
        console.error(err)
      }
    })
  )

  return plugins.filter((p) => p)
}

/**
 * Restart jobs
 */
export const restartJobs = async (): Promise<void> => {
  console.info('Restart jobs...')
  const simulations = await Simulation.getAll(['scheme', 'tasks'])

  // Check waiting or processing tasks
  await Promise.all(
    simulations.map(async (simulation) => {
      const tasks = simulation.tasks
        ?.filter((t) => t.status === 'wait' || t.status === 'process')
        .filter((t) => t)

      tasks &&
        (await Promise.all(
          tasks.map(async (task, index) => {
            console.info(
              ' - Restart simulation ' + simulation.id + ' - task ' + task.label
            )
            try {
              const pluginKey = task.plugin
              const plugin = tanatloc.plugins.find((p) => p.key === pluginKey)
              if (plugin && plugin.server.lib.monitoring) {
                const cloudConfiguration =
                  simulation.scheme?.configuration?.run?.cloudServer
                    ?.configuration
                await plugin.server.lib.monitoring(
                  simulation.id,
                  task.pid,
                  simulation.tasks,
                  task,
                  cloudConfiguration
                )
              }
            } catch (err) {
              console.warn(
                ' ⚠ Simulation ' +
                  simulation.id +
                  ' - task ' +
                  task.label +
                  ' restart failed!'
              )

              // Set task in error
              tasks[index].status = 'error'
              await Simulation.update({ id: simulation.id }, [
                {
                  key: 'tasks',
                  value: tasks
                }
              ])
            }
          })
        ))
    })
  )
}

/**
 * Server list
 * @returns List
 */
const serverList = async (): Promise<IServerPlugin[]> => {
  if (!tanatloc?.plugins) return []

  return tanatloc.plugins?.map((plugin) => ({
    category: plugin.category,
    key: plugin.key,
    ...plugin.server
  }))
}

/**
 * Client list
 * @param user User
 * @param complete Complete or filtered by user.authorizedplugins
 * @returns List
 */
const clientList = async (
  user?: { authorizedplugins?: string[] },
  complete?: boolean
): Promise<IClientPlugin[]> => {
  if (!tanatloc?.plugins) return []

  if (complete) {
    return tanatloc.plugins.map((plugin) => ({
      category: plugin.category,
      key: plugin.key,
      ...plugin.client
    }))
  } else {
    return tanatloc.plugins
      .map((plugin) => {
        if (user?.authorizedplugins?.includes(plugin.key))
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
