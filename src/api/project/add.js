import { call } from '../call'

/**
 * Add a project
 * @memberof module:src/api/project
 * @param {Object} workspace Workspace { id }
 * @param {Object} project Project { title, description }
 */
const add = async (workspace, project) => {
  return call('/api/project', {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    },
    body: JSON.stringify({ workspace: { id: workspace.id }, project: project })
  })
}

export default add
