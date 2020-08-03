import query from '../..'
import { databases } from '../../../../config/db'

export default async (username) => {
  const response = await query(
    'SELECT (id) FROM ' + databases.USERS + ' WHERE email = $1',
    [username]
  )

  const result = response.rows[0]
  const user = {
    ...result,
    username
  }
  return user
}
