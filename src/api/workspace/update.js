import Caller from '@/api/call'

/**
 * Update
 * @memberof API.Workspace
 * @param {Object} workspace Workspace { id }
 * @param {Array} data Data [{ key: value }, ...]
 */
const update = async (workspace, data) => {
  return Caller.call('/api/workspace', {
    method: 'PUT',
    body: JSON.stringify({ workspace: workspace, data: data })
  })
}

export default update
