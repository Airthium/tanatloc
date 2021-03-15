import Caller from '@/api/call'

/**
 * Add
 * @memberof module:api/plugin
 * @param {Object} plugin Plugin
 */
const add = async (plugin) => {
  return Caller.call('/api/plugin', {
    method: 'POST',
    body: JSON.stringify(plugin)
  })
}

export default add
