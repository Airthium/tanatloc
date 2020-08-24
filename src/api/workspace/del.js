import { call } from '../call'

/**
 * Delete a workspace
 * @memberof module:src/api/workspace
 * @param {Object} workspace Workspace { id }
 */
const del = async (workspace) => {
  const res = await call('/api/workspace', {
    method: 'DELETE',
    body: JSON.stringify(workspace)
  })

  return res
}

export default del
