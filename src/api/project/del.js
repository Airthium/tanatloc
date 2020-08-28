import { call } from '../call'

/**
 * Delete project
 * @memberof module:src/api/project
 * @param {Object} workspace Workspace { id }
 * @param {Object} project Project { id }
 */
const del = async (workspace, project) => {
  const res = await call('/api/project/' + project.id, {
    method: 'DELETE',
    body: JSON.stringify({ id: workspace.id })
  })

  return res
}

export default del
