import Caller from '@/api/call'

/**
 * List
 * @memberof API.Plugins
 * @returns {Array} List
 */
const completeList = async () => {
  return Caller.call('/api/plugins', {
    method: 'POST'
  })
}

export default completeList
