/** @module Lib.Plugins */

import isElectron from 'is-electron'

import { ClientPlugin, Plugin, ServerPlugin } from '@/plugins/index.d'

import Simulation from '../simulation'
import Tools from '../tools'
import { ISimulation, ISimulationTask } from '@/database/simulation'

/**
 * Load plugins
 * @return Plugins
 */
export const loadPlugins = async (): Promise<Plugin[]> => {
  console.info('Load plugins...')

  // Available directories
  const availables = await Tools.listDirectories(
    isElectron()
      ? `${process.resourcesPath}/extra/server/tanatloc/plugins`
      : './dist/plugins'
  )

  const plugins = []
  for (const available of availables) {
    process.stdout.write(' - Plugin ' + available)
    try {
      // Import
      const plugin = isElectron()
        ? await require(`../../../plugins/${available}`)
        : await import(`../../../plugins/${available}`)
      process.stdout.write(' loaded\n')
      plugins.push({
        rootDirectory: available,
        ...plugin.default
      })
    } catch (err) {
      process.stdout.write(' ERROR\n')
      console.error(err)
    }
  }

  return plugins.filter((p) => p)
}

/**
 * Restart job
 * @param simulation Simulation
 * @param task Task
 */
const restartJob = async (
  simulation: ISimulation<('scheme' | 'tasks')[]>,
  task: ISimulationTask
): Promise<void> => {
  try {
    const pluginKey = task.plugin
    const plugin = tanatloc.plugins.find((p) => p.key === pluginKey)
    if (plugin?.server.lib.monitoring) {
      const cloudConfiguration =
        simulation.scheme?.configuration?.run?.cloudServer?.configuration
      await plugin.server.lib.monitoring(
        simulation.id,
        task.pid,
        { tasks: simulation.tasks, currentTask: task },
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
    task.status = 'error'
  }
}

/**
 * Restart jobs
 */
export const restartJobs = async (): Promise<void> => {
  console.info('Restart jobs...')
  const simulations = await Simulation.getAll(['scheme', 'tasks'])

  // Check waiting or processing tasks
  for (const simulation of simulations) {
    const tasks = simulation.tasks ?? []

    let needUpdate = false
    for (const task of tasks) {
      if (!task || (task.status !== 'wait' && task.status !== 'process'))
        continue
      needUpdate = true
      console.info(
        ' - Restart simulation ' + simulation.id + ' - task ' + task.label
      )
      restartJob(simulation, task)
    }

    if (needUpdate)
      // Update simulation
      await Simulation.update({ id: simulation.id }, [
        {
          key: 'tasks',
          value: tasks
        }
      ])
  }
}

/**
 * Server list
 * @returns List
 */
const serverList = async (): Promise<ServerPlugin[]> => {
  if (!tanatloc?.plugins) return []

  return tanatloc.plugins?.map((plugin) => ({
    category: plugin.category,
    key: plugin.key,
    rootDirectory: plugin.rootDirectory,
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
): Promise<ClientPlugin[]> => {
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
