import Caller from '@/api/call'

/**
 * Stop
 * @memberof API.Simulation
 * @param {Object} simulation Simulation { id }
 * @returns {Object} { ok: true }
 */
const stop = async (simulation) => {
  return Caller.call('/api/simulation/' + simulation.id + '/stop', {
    method: 'GET'
  })
}

export default stop
