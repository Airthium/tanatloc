import Caller from '@/api/call'

/**
 * Delete
 * @memberof API.Project
 * @param {Object} workspace Workspace `{ id }`
 * @param {Object} project Project `{ id }`
 */
const del = async (workspace, project) => {
  await Caller.call('/api/project/' + project.id, {
    method: 'DELETE',
    body: JSON.stringify({ id: workspace.id })
  })
}

export default del
