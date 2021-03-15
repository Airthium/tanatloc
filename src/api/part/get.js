import Caller from '@/api/call'

/**
 * Get part
 * @memberof module:api/part
 * @param {Object} simulation Simulation { id }
 * @param {Object} file File { part, partPath }
 */
const get = async (simulation, file) => {
  return Caller.call('/api/part', {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    },
    body: JSON.stringify({ simulation, file })
  })
}

export default get
