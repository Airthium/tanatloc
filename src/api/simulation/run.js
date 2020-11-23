import { call } from '../call'

/**
 * Run simulation
 * @param {Object} simulation Simulation { id }
 */
const run = async (simulation) => {
  return call('/api/simulation/' + simulation.id + '/run', {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    }
  })
}

export default run
