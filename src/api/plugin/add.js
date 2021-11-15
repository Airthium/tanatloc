import { call } from '@/api/call'

/**
 * Add
 * @memberof API.Plugin
 * @param {Object} plugin Plugin
 */
const add = async (plugin) => {
  await call('/api/plugin', {
    method: 'POST',
    body: JSON.stringify(plugin)
  })
}

export default add
