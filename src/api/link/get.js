import Caller from '@/api/call'

/**
 * Get
 * @memberof module:api/link
 * @param {string} id Id
 * @param {Array} data Data
 */
const get = async (id, data) => {
  return Caller.call('/api/link', {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    },
    body: JSON.stringify({ id, data })
  })
}

export default get
