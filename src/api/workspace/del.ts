import { call } from '@/api/call'

/**
 * Delete
 * @memberof API.Workspace
 * @param {Object} workspace Workspace `{ id }`
 */
export const del = async (workspace: { id: string }): Promise<void> => {
  await call('/api/workspace', {
    method: 'DELETE',
    body: JSON.stringify(workspace)
  })
}
