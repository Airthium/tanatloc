import Caller from '@/api/call'

/**
 * Delete
 * @memberof API.Plugin
 * @param {Object} plugin Plugin
 */
const del = async (plugin) => {
  await Caller.call('/api/plugin', {
    method: 'DELETE',
    body: JSON.stringify(plugin)
  })
}

export default del
