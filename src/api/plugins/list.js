import { call } from '@/api/call'

/**
 * List
 * @memberof API.Plugins
 * @returns {Array} List
 */
const list = async () => {
  return call('/api/plugins', {
    method: 'GET'
  })
}

export default list
