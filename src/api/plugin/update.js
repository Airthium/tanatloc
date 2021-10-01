import Caller from '@/api/call'

/**
 * Update
 * @memberof API.Plugin
 * @param {Object} plugin Plugin
 */
const update = async (plugin) => {
  await Caller.call('/api/plugin', {
    method: 'PUT',
    body: JSON.stringify(plugin)
  })
}

export default update
