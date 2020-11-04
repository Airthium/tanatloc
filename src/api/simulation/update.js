import { call } from '../call'

/**
 * Update simulation
 * @memberof module:src/api/simulation
 * @param {Object} simulation Simulation
 * @param {Array} data Data [{ key, value, ... }, ...]
 */
const update = async (simulation, data) => {
  return call('/api/simulation/' + simulation.id, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}

export default update
