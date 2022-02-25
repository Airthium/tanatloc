/** @module API.Project.Del */

import { call } from '@/api/call'

/**
 * Delete
 * @param workspace Workspace
 * @param project Project
 */
export const del = async (
  workspace: { id: string },
  project: { id: string }
): Promise<void> => {
  await call('/api/project/' + project.id, {
    method: 'DELETE',
    body: JSON.stringify({ id: workspace.id })
  })
}
