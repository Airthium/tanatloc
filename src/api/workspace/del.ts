/** @module API.Workspace.Del */

import { call } from '@/api/call'

/**
 * Delete
 * @param workspace Workspace
 */
export const del = async (workspace: { id: string }): Promise<void> => {
  await call('/api/workspace', {
    method: 'DELETE',
    body: JSON.stringify(workspace)
  })
}
