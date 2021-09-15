import Caller from '@/api/call'

/**
 * List
 * @memberof module:api/plugins
 */
const list = async () => {
  return Caller.call('/api/plugins', {
    method: 'GET'
  })
}

export default list
