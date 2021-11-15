import { call } from '@/api/call'

/**
 * Log
 * @memberof API.Simulation
 * @param {Object} simulation Simulation `{ id }`
 * @param {string} file File
 * @returns {string} Log
 */
const log = async (simulation, file) => {
  return call('/api/simulation/' + simulation.id + '/log', {
    method: 'POST',
    body: JSON.stringify({ file })
  })
}

export default log
