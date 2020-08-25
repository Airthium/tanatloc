import query from '..'
import { databases } from '../../../config/db'

/**
 * Update
 * @memberof module:src/database/project
 * @param {Object} param0 { projject {id }, data: { key: value }}
 */
const update = async ({ project, data }) => {
  await Promise.all(
    Object.keys(data).map(async (key) => {
      return await query(
        'UPDATE ' + databases.PROJECTS + ' SET ' + key + ' = $2 WHERE id = $1',
        [project.id, data[key]]
      )
    })
  )
}

export default update
