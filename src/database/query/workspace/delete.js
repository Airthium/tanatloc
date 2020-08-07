import query from '../..'
import { databases } from '../../../../config/db'

export default async (id, workspace) => {
  await query('DELETE FROM ' + databases.WORKSPACES + ' WHERE id = $1', [
    workspace.id
  ])

  await query(
    'UPDATE ' +
      databases.USERS +
      ' SET workspaces = array_remove(workspaces, $2) WHERE id = $1',
    [id, workspace.id]
  )
}
