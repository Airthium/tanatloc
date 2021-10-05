import Caller from '@/api/call'

/**
 * Add
 * @memberof API.Project
 * @param {Object} workspace Workspace `{ id }`
 * @param {Object} project Project `{ title, description }`
 * @returns {Object} Project `{ id, title, description, owners, workspace }`
 */
const add = async (workspace, project) => {
  return Caller.call('/api/project', {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    },
    body: JSON.stringify({ workspace: { id: workspace.id }, project: project })
  })
}

export default add
