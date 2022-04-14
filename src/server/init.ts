import { checkdB, startdB } from '@/database'

import { loadPlugins, restartJobs } from '@/lib/plugins'
import { loadTemplates } from '@/lib/template'

const init = async () => {
  !tanatloc && (tanatloc = {})

  // Start database
  if (!tanatloc?.pool) {
    const check = await checkdB()
    if (!check) throw new Error('Database not found')
    tanatloc.pool = startdB()
  }

  // Load plugins
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

  // Load templates
  if (!tanatloc?.templates) {
    try {
      tanatloc.templates = await loadTemplates()
    } catch (err) {
      console.error('Templates load failed!')
      console.error(err)
    }
  }
}

export default init
