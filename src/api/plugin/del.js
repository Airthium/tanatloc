import Caller from '@/api/call'

/**
 * Delete
 * @memberof module:api/plugin
 * @param {Object} plugin Plugin
 */
const del = async (plugin) => {
  return Caller.call('/api/plugin', {
    method: 'DELETE',
    body: JSON.stringify(plugin)
  })
}

export default del
