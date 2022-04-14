import { loadPlugins, restartJobs } from '@/lib/plugins'
import { loadTemplates } from '@/lib/template'

import { initDatabase } from './init/database'

/**
 * Init plugins
 */
export const initPlugins = async (): Promise<void> => {
  !tanatloc && (tanatloc = {})

  if (!tanatloc?.plugins) {
    try {
      tanatloc.plugins = await loadPlugins()

      try {
        await restartJobs()
      } catch (err) {
        console.error('Restart jobs failed!')
        console.error(err)
      }
    } catch (err) {
      console.error('Plugins load failed!')
      console.error(err)
    }
  }
}

/**
 * Init templates
 */
export const initTemplates = async (): Promise<void> => {
  !tanatloc && (tanatloc = {})

  if (!tanatloc?.templates) {
    try {
      tanatloc.templates = await loadTemplates()
    } catch (err) {
      console.error('Templates load failed!')
      console.error(err)
    }
  }
}

/**
 * Init
 */
const init = async (): Promise<void> => {
  // Start database
  await initDatabase()

  // Load plugins
  await initPlugins()

  // Load templates
  await initTemplates()
}

export default init
