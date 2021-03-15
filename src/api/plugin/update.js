import Caller from '@/api/call'

/**
 * Update
 * @memberof module:api/plugin
 * @param {Object} plugin Plugin
 */
const update = async (plugin) => {
  return Caller.call('/api/plugin', {
    method: 'PUT',
    body: JSON.stringify(plugin)
  })
}

export default update
