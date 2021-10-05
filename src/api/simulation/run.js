import Caller from '@/api/call'

/**
 * Run
 * @memberof API.Simulation
 * @param {Object} simulation Simulation `{ id }`
 * @returns {Object} { ok: true }
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
