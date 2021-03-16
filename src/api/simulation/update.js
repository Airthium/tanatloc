import Caller from '@/api/call'

/**
 * Update simulation
 * @memberof module:api/simulation
 * @param {Object} simulation Simulation
 * @param {Array} data Data [{ key, value, ... }, ...]
 */
const update = async (simulation, data) => {
  return Caller.call('/api/simulation/' + simulation.id, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}

export default update
