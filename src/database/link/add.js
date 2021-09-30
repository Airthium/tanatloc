import query from '..'
import { tables } from '@/config/db'

/**
 * Add
 * @memberof Database.Link
 * @param {Object} link Link { type, email, ?userid }
 * @returns {Object} Link { id, type, email, userid }
 */
const add = async ({ type, email, userid }) => {
  const response = await query(
    'INSERT INTO ' +
      tables.LINKS +
      ' (type, email, userid) VALUES ($1, $2, $3) RETURNING id',
    [type, email, userid]
  )

  const link = response.rows[0]
  link && (link.type = type)
  link && (link.email = email)
  link && (link.userid = userid)

  return link
}

export default add
