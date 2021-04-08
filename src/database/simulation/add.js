import query from '..'
import { tables } from '@/config/db'

/**
 * Add
 * @memberof module:database/simulation
 * @param {Object} simulation Simulation { name, scheme, project }
 */
const add = async ({ name, scheme, project }) => {
  const response = await query(
    'INSERT INTO ' +
      tables.SIMULATIONS +
      ' (name, scheme, project) VALUES ($1, $2, $3) RETURNING id',
    [name, scheme, project]
  )

  const simulation = response.rows[0]
  simulation.name = name
  simulation.scheme = scheme

  return simulation
}

export default add
