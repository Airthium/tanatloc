import Caller from '@/api/call'

/**
 * Stop simulation
 * @param {Object} simulation Simulation { id }
 */
const stop = async (simulation) => {
  return Caller.call('/api/simulation/' + simulation.id + '/stop', {
    method: 'GET'
  })
}

export default stop
