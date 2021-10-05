import Caller from '@/api/call'

/**
 * Add
 * @memberof API.Simulation
 * @param {Object} project Project `{ id }`
 * @param {Object} simulation Simulation `{ name, scheme }`
 * @returns {Object} Simulation `{ id, name, scheme, project }`
 */
const add = async (project, simulation) => {
  return Caller.call('/api/simulation', {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    },
    body: JSON.stringify({
      project: { id: project.id },
      simulation: simulation
    })
  })
}

export default add
