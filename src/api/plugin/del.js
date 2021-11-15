import { call } from '@/api/call'

/**
 * Delete
 * @memberof API.Plugin
 * @param {Object} plugin Plugin
 */
const del = async (plugin) => {
  await call('/api/plugin', {
    method: 'DELETE',
    body: JSON.stringify(plugin)
  })
}

export default del
