import { call } from '../call'

/**
 * Update a workspace
 * @memberof module:src/api/workspace
 * @param {Object} workspace Workspace { id }
 * @param {Array} data Data [{ key: value }, ...]
 */
const update = async (workspace, data) => {
  const res = await call('/api/workspace', {
    method: 'PUT',
    body: JSON.stringify({ workspace: workspace, data: data })
  })

  return res
}

export default update
