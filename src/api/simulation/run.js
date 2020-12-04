import Caller from '../call'

/**
 * Run simulation
 * @memberof module:src/api/simulation
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
