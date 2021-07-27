import query from '..'
import { tables } from '@/config/db'

/**
 * Add
 * @memberof module:database/link
 * @param {Object} link Link { type, email, ?userid }
 */
const add = async ({ type, email, userid }) => {
  const response = await query(
    'INSERT INTO ' +
      tables.LINKS +
      ' (type, email, userid) VALUES ($1, $2, $3) RETURNING id',
    [type, email, userid]
  )

  return response.rows[0]
}

export default add
