import query from '..'
import { databases } from '../../../config/db'

/**
 * Get by user id
 * @memberof module:src/database/workspace
 * @param {string} id User id
 */
const getByUserId = async (id) => {
  const response = await query(
    'SELECT workspaces FROM ' + databases.USERS + ' WHERE id = $1',
    [id]
  )

  const workspacesList = response.rows[0].workspaces
  const workspaces = Promise.all(
    workspacesList.map(async (workspace) => {
      const data = await query(
        'SELECT name, owners, users, projects FROM ' +
          databases.WORKSPACES +
          ' WHERE id = $1',
        [workspace]
      )
      return {
        id: workspace,
        ...data.rows[0]
      }
    })
  )

  return workspaces
}

export default getByUserId
