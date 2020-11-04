import { call } from '../call'

/**
 * Delete a workspace
 * @memberof module:src/api/workspace
 * @param {Object} workspace Workspace { id }
 */
const del = async (workspace) => {
  return call('/api/workspace', {
    method: 'DELETE',
    body: JSON.stringify(workspace)
  })
}

export default del
