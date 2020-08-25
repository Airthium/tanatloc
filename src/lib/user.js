import query from '../database'
import { databases } from '../../config/db'

const getUser = async (id) => {
  try {
    const response = await query(
      'SELECT lastname, firstname, email, avatar FROM ' +
        databases.USERS +
        ' WHERE id = $1',
      [id]
    )

    const result = response.rows[0]
    result.username = result.email // TODO modify the dB for that
    delete result.email
    const user = {
      id: id,
      ...result
    }
    return user
  } catch (err) {
    console.error(err)
  }
}

export { getUser }
