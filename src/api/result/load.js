import { call } from '@/api/call'

/**
 * Load
 * @memberof API.Result
 * @param {Object} simulation  Simulation `{ id }`
 * @param {Object} result Result `{ originPath, glb }`
 * @returns {Object} Result `{ buffer }`
 */
const load = async (simulation, result) => {
  return call('/api/result', {
    method: 'POST',
    body: JSON.stringify({ simulation, result })
  })
}

export default load
