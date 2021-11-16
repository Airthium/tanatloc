import { INewProject } from '@/database/index.d'

import { call } from '@/api/call'

/**
 * Add
 * @memberof API.Project
 * @param workspace Workspace
 * @param project Project
 * @returns New project
 */
export const add = async (
  workspace: { id: string },
  project: { title: string; description: string }
): Promise<INewProject> => {
  const response = await call('/api/project', {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    },
    body: JSON.stringify({ workspace: { id: workspace.id }, project: project })
  })

  return response.json()
}
