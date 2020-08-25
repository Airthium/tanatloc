import query from '..'
import { databases } from '../../../config/db'

/**
 * Delete project
 * @memberof module:src/database/project
 * @param {Object} param0 { workspaceId, project }
 */
const del = async ({ id, project }) => {
  // Delete project
  await query('DELETE FROM ' + databases.PROJECTS + ' WHERE id = $1', [id])

  // Delete project reference in workspace
  await query(
    'UPDATE ' +
      databases.WORKSPACES +
      ' SET projects = array_remove(projects, $2) WHERE id = $1',
    [id, project.id]
  )
}

export default del
