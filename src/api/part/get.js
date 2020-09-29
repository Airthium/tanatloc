import { call } from '../call'

/**
 * Get part
 * @memberof module:src/api/part
 * @param {Object} simulation Simulation { id }
 * @param {Object} file File { part, partPath }
 */
const get = async (simulation, file) => {
  const res = await call('/api/part', {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    },
    body: JSON.stringify({ simulation, file })
  })

  return res
}

export default get
