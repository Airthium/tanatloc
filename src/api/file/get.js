import Caller from '@/api/call'

/**
 * Get file
 * @memberof module:api/file
 * @param {Object} simulation Simulation { id }
 * @param {Object} file File { origin, originPath }
 */
const get = async (simulation, file) => {
  return Caller.call('/api/file', {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    },
    body: JSON.stringify({ simulation, file })
  })
}

export default get
