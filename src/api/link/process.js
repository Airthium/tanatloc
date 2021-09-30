import Caller from '@/api/call'

/**
 * Process
 * @memberof API.Link
 * @param {string} id Id
 * @param {Object} data Data { email, password }
 *
 */
const process = async (id, data) => {
  await Caller.call('/api/link', {
    method: 'PUT',
    body: JSON.stringify({ id, data })
  })
}

export default process
