import Caller from '@/api/call'

/**
 * Delete
 * @memberof module:api/workspace
 * @param {Object} workspace Workspace { id }
 */
const del = async (workspace) => {
  return Caller.call('/api/workspace', {
    method: 'DELETE',
    body: JSON.stringify(workspace)
  })
}

export default del
