import { call } from '@/api/call'

/**
 * Delete
 * @memberof API.Simulation
 * @param {Object} simulation Simulation `{id }`
 */
const del = async (simulation) => {
  await call('/api/simulation/' + simulation.id, {
    method: 'DELETE'
  })
}

export default del
