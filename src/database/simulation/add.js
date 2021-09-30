import query from '..'
import { tables } from '@/config/db'

/**
 * Add
 * @memberof Database.Simulation
 * @param {Object} simulation Simulation { name, scheme, project }
 * @returns {Object} Simulation { id, name, scheme, project }
 */
const add = async ({ name, scheme, project }) => {
  const response = await query(
    'INSERT INTO ' +
      tables.SIMULATIONS +
      ' (name, scheme, project) VALUES ($1, $2, $3) RETURNING id',
    [name, scheme, project]
  )

  const simulation = response.rows[0]
  simulation && (simulation.name = name)
  simulation && (simulation.scheme = scheme)
  simulation && (simulation.project = project)

  return simulation
}

export default add
