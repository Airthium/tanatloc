import { call } from '../call'

/**
 * Get part
 * @memberof module:src/api/file
 * @param {Object} simulation Simulation { id }
 * @param {Object} file File { origin, originPath }
 */
const get = async (simulation, file) => {
  const res = await call('/api/file', {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    },
    body: JSON.stringify({ simulation, file })
  })

  return res
}

export default get
