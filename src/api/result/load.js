import Caller from '@/api/call'

/**
 * Load result
 * @param {Object} simulation  Simulation { id }
 * @param {Object} result Result { originPath, glb }
 * @returns
 */
const load = async (simulation, result) => {
  return Caller.call('/api/result', {
    method: 'POST',
    body: JSON.stringify({ simulation, result })
  })
}

export default load
