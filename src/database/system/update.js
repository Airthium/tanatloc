import query from '..'
import { databases } from '@/config/db'

/**
 * Update system items
 * @memberof module:src/database/system
 * @param {Object} data Data [{ key, value }, ...]
 */
const update = async (data) => {
  await Promise.all(
    data.map(async (d) => {
      return await query(
        'UPDATE ' + databases.SYSTEM + ' SET ' + d.key + ' = $1',
        [d.value]
      )
    })
  )
}

export default update
