import Caller from '@/api/call'

/**
 * Delete
 * @memberof API.Workspace
 * @param {Object} workspace Workspace `{ id }`
 */
const del = async (workspace) => {
  await Caller.call('/api/workspace', {
    method: 'DELETE',
    body: JSON.stringify(workspace)
  })
}

export default del
