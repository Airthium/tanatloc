import Caller from '@/api/call'

/**
 * Delete simulation
 * @memberof module:api/simulation
 * @param {Object} project Project { id }
 * @param {Object} simulation Simulation {id }
 */
const del = async (project, simulation) => {
  return Caller.call('/api/simulation/' + simulation.id, {
    method: 'DELETE',
    body: JSON.stringify({ id: project.id })
  })
}

export default del
