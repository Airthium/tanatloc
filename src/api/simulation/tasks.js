import Caller from '@/api/call'

/**
 * Simulation tasks
 * @memberof module:api/simulation
 * @param {Object} simulation Simulation { id }
 */
const tasks = async (simulation) => {
  return Caller.call('/api/simulation/' + simulation.id + '/tasks', {
    method: 'GET'
  })
}

export default tasks
