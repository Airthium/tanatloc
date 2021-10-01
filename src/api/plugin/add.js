import Caller from '@/api/call'

/**
 * Add
 * @memberof API.Plugin
 * @param {Object} plugin Plugin
 */
const add = async (plugin) => {
  await Caller.call('/api/plugin', {
    method: 'POST',
    body: JSON.stringify(plugin)
  })
}

export default add
