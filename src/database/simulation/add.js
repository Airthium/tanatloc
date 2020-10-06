import query from '..'
import { databases } from '../../../config/db'

/**
 * Add
 * @memberof module:src/database/simulation
 * @param {Object} simulation Simulation { name, scheme }
 */
const add = async ({ name, scheme }) => {
  const response = await query(
    'INSERT INTO ' +
      databases.SIMULATIONS +
      ' (name, scheme) VALUES ($1, $2) RETURNING id',
    [name, scheme]
  )

  const simulation = response.rows[0]
  simulation.name = name
  simulation.scheme = scheme

  return simulation
}

export default add
