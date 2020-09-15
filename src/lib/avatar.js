import { promises as fs } from 'fs'

import query from '../database'
import { databases } from '../../config/db'

const read = async (id) => {
  const response = await query(
    'SELECT path FROM ' + databases.AVATARS + ' WHERE id = $1',
    [id]
  )

  const path = response.rows[0].path

  // Read file
  const avatar = await fs.readFile(path)
  return avatar.toString()
}

export { read }
