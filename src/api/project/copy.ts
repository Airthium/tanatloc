/** @module API.Project.Copy */

import { IFrontNewProject } from '../index.d'

import { call } from '@/api/call'

/**
 * Copy
 * @param workspace Workspace
 * @param project Project
 * @returns Project copy
 */
export const copy = async (
  workspace: { id: string },
  project: { id: string }
): Promise<IFrontNewProject> => {
  const response = await call('/api/project/' + project.id + '/copy', {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    },
    body: JSON.stringify({ workspace: { id: workspace.id } })
  })

  return response.json()
}
