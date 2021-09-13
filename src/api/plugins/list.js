import Caller from '@/api/call'

/**
 * List
 * @memberof module:api/plugins
 * @param {Object} user User
 */
const list = async (user) => {
  return Caller.call('/api/plugins', {
    method: 'GET'
  })
}

export default list
