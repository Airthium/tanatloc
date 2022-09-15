import { execSync } from 'child_process'

import { loadPlugins, restartJobs } from '@/lib/plugins'
import { loadTemplates } from '@/lib/template'

import { initDatabase } from './database'

/**
 * Init dockers
 */
export const initDockers = async (params?: {
  addStatus: (status: string) => Promise<void>
}): Promise<void> => {
  // tanatloc/worker
  try {
    execSync('docker image inspect tanatloc/worker')
  } catch (err) {
    await params?.addStatus('Pulling tanatloc/worker')
    execSync('docker pull tanatloc/worker')
  }

  // postgres
  try {
    execSync('docker image inspect postgres')
  } catch (err) {
    await params?.addStatus('Pulling postgres')
    execSync('docker pull postgres')
  }
}

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
  // Check dockers
  await params?.addStatus('Initialize Dockers')
  await initDockers(params)

  // Start database
  await params?.addStatus('Initialize Database')
  await initDatabase(params)

  // Load plugins
  await params?.addStatus('Initialize Plugins')
  await initPlugins()

  // Load templates
  await params?.addStatus('Initialize Templates')
  await initTemplates()

  // Restart jobs
  await initJobs()
}

export default init
