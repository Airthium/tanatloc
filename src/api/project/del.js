import Caller from '@/api/call'

/**
 * Delete project
 * @memberof module:api/project
 * @param {Object} workspace Workspace { id }
 * @param {Object} project Project { id }
 */
const del = async (workspace, project) => {
  return Caller.call('/api/project/' + project.id, {
    method: 'DELETE',
    body: JSON.stringify({ id: workspace.id })
  })
}

export default del
