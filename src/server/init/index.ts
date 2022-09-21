import { loadPlugins, restartJobs } from '@/lib/plugins'
import { loadTemplates } from '@/lib/template'

import { initDatabase } from './database'

/**
 * Init plugins
 */
export const initPlugins = async (): Promise<void> => {
  if (!tanatloc?.plugins) {
    try {
      tanatloc.plugins = await loadPlugins()
    } catch (err) {
      console.error('Plugins load failed!')
      console.error(err)
    }
  }
}

/**
 * Init jobs
 */
export const initJobs = async (): Promise<void> => {
  try {
    await restartJobs()
  } catch (err) {
    console.error('Restart jobs failed!')
    console.error(err)
  }
}

/**
 * Init templates
 */
export const initTemplates = async (): Promise<void> => {
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
const init = async (params?: {
  addStatus: (status: string) => Promise<void>
}): Promise<void> => {
  // Start database
  await params?.addStatus('Initializing Database')
  await initDatabase(params)

  // Load plugins
  await params?.addStatus('Initializing Plugins')
  await initPlugins()

  // Load templates
  await params?.addStatus('Initializing Templates')
  await initTemplates()

  // Restart jobs
  await initJobs()
}

export default init
