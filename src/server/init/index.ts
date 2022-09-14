import { execSync } from 'child_process'

import { loadPlugins, restartJobs } from '@/lib/plugins'
import { loadTemplates } from '@/lib/template'

import { initDatabase } from './database'

/**
 * Init dockers
 */
export const initDockers = async (
  status?: string[],
  setStatus?: (status: string[]) => Promise<void>
): Promise<void> => {
  // tanatloc/worker
  try {
    execSync('docker image inspect tanatloc/worker')
  } catch (err) {
    status?.push('Pulling tanatloc/worker')
    await setStatus?.(status!)
    execSync('docker pull tanatloc/worker')
  }

  // postgres
  try {
    execSync('docker image inspect postgres')
  } catch (err) {
    status?.push('Pulling postgres')
    await setStatus?.(status!)
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
const init = async (
  status?: string[],
  setStatus?: (status: string[]) => Promise<void>
): Promise<void> => {
  // Check dockers
  status?.push('Initialize Dockers')
  await setStatus?.(status!)
  await initDockers(status, setStatus)

  // Start database
  status?.push('Initialize Database')
  await setStatus?.(status!)
  await initDatabase(status, setStatus)

  // Load plugins
  status?.push('Initialize Plugins')
  await setStatus?.(status!)
  await initPlugins()

  // Load templates
  status?.push('Initialize Templates')
  await setStatus?.(status!)
  await initTemplates()

  // Restart jobs
  await initJobs()
}

export default init
