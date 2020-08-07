import query from '../..'
import { databases } from '../../../../config/db'

// TODO manage different types

export default async ({ workspace, data }) => {
  Promise.all(
    Object.keys(data).map(async (key) => {
      return await query(
        'UPDATE ' +
          databases.WORKSPACES +
          ' SET ' +
          key +
          ' = $2 WHERE id = $1',
        [workspace.id, data[key]]
      )
    })
  )
}
