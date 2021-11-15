import { call } from '@/api/call'

/**
 * Get
 * @memberof API.Link
 * @param {string} id Id
 * @param {Array} data Data
 * @returns {Object} Link `{ id, ...data }`
 */
const get = async (id, data) => {
  return call('/api/link', {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    },
    body: JSON.stringify({ id, data })
  })
}

export default get
