import { call } from '@/api/call'

/**
 * Update
 * @memberof API.Workspace
 * @param {Object} workspace Workspace `{ id }`
 * @param {Array} data Data `[{ key: value }, ...]`
 */
const update = async (workspace, data) => {
  await call('/api/workspace', {
    method: 'PUT',
    body: JSON.stringify({ workspace: workspace, data: data })
  })
}

export default update
