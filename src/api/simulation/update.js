import { call } from '@/api/call'

/**
 * Update
 * @memberof API.Simulation
 * @param {Object} simulation Simulation `{ id }`
 * @param {Array} data Data `[{ key, value, ... }, ...]`
 */
const update = async (simulation, data) => {
  await call('/api/simulation/' + simulation.id, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}

export default update
