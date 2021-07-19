import Caller from '@/api/call'

/**
 * Simulation log
 * @memberof module:api/simulation
 * @param {Object} simulation Simulation { id }
 * @param {string} file File
 */
const log = async (simulation, file) => {
  return Caller.call('/api/simulation/' + simulation.id + '/log', {
    method: 'POST',
    body: JSON.stringify({ file })
  })
}

export default log
