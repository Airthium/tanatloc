import query from '../..'
import { databases } from '../../../../config/db'

export default async ({ email }) => {
  const response = await query(
    'SELECT (id) FROM ' + databases.USERS + ' WHERE email = $1',
    [email]
  )

  const result = response.rows[0]
  const user = {
    id: result.id,
    username: email
  }
  return user
}
