import Caller from '@/api/call'

/**
 * List
 * @memberof API.Plugins
 * @returns {Array} List
 */
const list = async () => {
  return Caller.call('/api/plugins', {
    method: 'GET'
  })
}

export default list
