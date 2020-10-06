import { call } from '../call'

/**
 * Add a simulation
 * @memberof module:src/api/simulation
 * @param {Object} project Project { id }
 * @param {Object} simulation Simulation { name, scheme }
 */
const add = async (project, simulation) => {
  const res = await call('/api/simulation', {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    },
    body: JSON.stringify({
      project: { id: project.id },
      simulation: simulation
    })
  })

  return res
}

export default add
