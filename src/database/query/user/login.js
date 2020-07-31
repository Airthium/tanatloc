import query from '../..'
import { databases } from '../../../../config/db'

export default async ({ username, password }) => {
  const response = await query(
    'SELECT id FROM ' +
      databases.USERS +
      ' WHERE email = $1 AND password = crypt($2, password)',
    [username, password]
  )

  const result = response.rows[0]
  const user = {
    ...result,
    username: username
  }
  return user
}
