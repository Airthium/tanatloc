const init = async () => {
  console.info('Initializing back-end...')

  // Start database
  if (!global.initialization?.database) {
    const { checkdB, startdB } = await import('@/database')
    const check = await checkdB()
    if (!check) throw new Error('Database not found')
    startdB()
  }

  // Load plugins
  if (!global.initialization?.plugins) {
    try {
      const { loadPlugins, restartJobs } = await import('@/lib/plugins/index')

      await loadPlugins()

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
  if (!global.initialization?.templates) {
    try {
      const { loadTemplates } = await import('@/lib/template/index')

      await loadTemplates()
    } catch (err) {
      console.error('Templates load failed!')
      console.error(err)
    }
  }
}

export default init
