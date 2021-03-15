import Caller from '@/api/call'

/**
 * Run simulation
 * @memberof module:api/simulation
 * @param {Object} simulation Simulation { id }
 */
const run = async (simulation) => {
  return Caller.call('/api/simulation/' + simulation.id + '/run', {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    }
  })
}

export default run
