import query from '..'
import { tables } from '@/config/db'

/**
 * Add avatar
 * @memberof module:database/avatar
 * @param {Object} data Data { name, path }
 */
const add = async ({ name, path }) => {
  const response = await query(
    'INSERT INTO ' +
      tables.AVATARS +
      ' (name, path) VALUES ($1, $2) RETURNING id',
    [name, path]
  )

  const avatar = response.rows[0]
  avatar.name = name

  return avatar
}

export default add
