import Caller from '@/api/call'

/**
 * Process
 * @memberof module:api/link
 * @param {string} id Id
 * @param {Object} data Data { email, password }
 * @returns
 */
const process = async (id, data) => {
  return Caller.call('/api/link', {
    method: 'PUT',
    body: JSON.stringify({ id, data })
  })
}

export default process
