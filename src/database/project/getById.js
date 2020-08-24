import query from '..'
import { databases } from '../../../config/db'

const getById = async (id) => {
  const response = await query(
    'SELECT title FROM ' + databases.PROJECTS + ' WHERE id = $1',
    [id]
  )

  const project = response.rows[0]
  return project
}

export default getById
