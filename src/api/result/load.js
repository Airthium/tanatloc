import Caller from '@/api/call'

/**
 * Load
 * @memberof API.Result
 * @param {Object} simulation  Simulation `{ id }`
 * @param {Object} result Result `{ originPath, glb }`
 * @returns {Object} Result `{ buffer }`
 */
const load = async (simulation, result) => {
  return Caller.call('/api/result', {
    method: 'POST',
    body: JSON.stringify({ simulation, result })
  })
}

export default load
