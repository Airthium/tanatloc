import Caller from '@/api/call'

/**
 * Tasks
 * @memberof API.Simulation
 * @param {Object} simulation Simulation { id }
 * @returns {Array} Tasks
 */
const tasks = async (simulation) => {
  return Caller.call('/api/simulation/' + simulation.id + '/tasks', {
    method: 'GET'
  })
}

export default tasks
