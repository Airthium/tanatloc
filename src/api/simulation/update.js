import { call } from '../call'

/**
 * Update simulation
 * @memberof module:src/api/simulation
 * @param {Object} simulation Simulation
 * @param {Array} data Data [{ key, value, ... }, ...]
 */
const update = async (simulation, data) => {
  const res = await call('/api/simulation/' + simulation.id, {
    method: 'PUT',
    body: JSON.stringify(data)
  })

  return res
}

export default update
