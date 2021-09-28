import Caller from '@/api/call'

/**
 * List
 * @memberof module:api/plugins
 */
const completeList = async () => {
  return Caller.call('/api/plugins', {
    method: 'POST'
  })
}

export default completeList
