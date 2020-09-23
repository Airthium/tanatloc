import query from '..'
import { databases } from '../../../config/db'

/**
 * Add avatar
 * @memberof module:src/database/avatar
 * @param {Object} data Data { name, path }
 */
const add = async ({ name, path }) => {
  const response = await query(
    'INSERT INTO ' +
      databases.AVATARS +
      ' (name, path) VALUES ($1, $2) RETURNING id',
    [name, path]
  )

  const avatar = response.rows[0]
  return avatar
}

export default add
