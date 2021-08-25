import UserLib from '@/lib/user'
import PluginLib from '@/lib/plugin'

// Add Rescale walltime
const rescale = async () => {
  console.info('Rescale plugin update...')

  // Get users
  const users = await UserLib.getAll(['id', 'plugins'])

  // Update plugins
  await Promise.all(
    users.map(async (user) => {
      if (user.plugins) {
        await Promise.all(
          user.plugins.map(async (plugin) => {
            if (plugin.key === 'rescale') {
              let needUpdate = false

              if (!plugin.data.walltime) {
                plugin.data.walltime = 48
                needUpdate = true
              }

              if (!plugin.configuration.walltime) {
                plugin.configuration.walltime = {
                  label: 'Default walltime (hours)',
                  type: 'input',
                  default: '48',
                  value: '48'
                }
                needUpdate = true
              }

              if (!plugin.inUseConfiguration.walltime) {
                plugin.inUseConfiguration.walltime = {
                  label: 'Walltime'
                }
                needUpdate = true
              }

              if (needUpdate) {
                await PluginLib.update({ id: user.id }, plugin)
                console.info('Plugin updated')
              }
            }
          })
        )
      }
    })
  )
}

export default rescale
