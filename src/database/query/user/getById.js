import query from '../..'
import { databases } from '../../../../config/db'

export default async ({ id }) => {
  const response = await query(
    'SELECT (email) FROM ' + databases.USERS + ' WHERE id = $1',
    [id]
  )

  const result = response.rows[0]
  const user = {
    id: id,
    username: result.email
  }
  return user
}
