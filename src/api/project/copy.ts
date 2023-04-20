/** @module API.Project.Copy */

import { IFrontProject } from '../index.d'

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
): Promise<IFrontProject> => {
  const response = await call('/api/project/' + project.id + '/copy', {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    },
    body: JSON.stringify({ workspace: { id: workspace.id } })
  })

  return response.json()
}
