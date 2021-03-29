import Caller from '@/api/call'

/**
 * Delete simulation
 * @memberof module:api/simulation
 * @param {Object} simulation Simulation {id }
 */
const del = async (simulation) => {
  return Caller.call('/api/simulation/' + simulation.id, {
    method: 'DELETE'
  })
}

export default del
