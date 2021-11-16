import { INewWorkspace } from '@/database/index.d'

import { call } from '@/api/call'

/**
 * Add
 * @memberof API.Workspace
 * @param {Object} workspace Workspace `{ name }`
 * @returns {Object} Workspace `{ id, name, owners }`
 */
export const add = async (workspace: {
  name: string
}): Promise<INewWorkspace> => {
  const response = await call('/api/workspace', {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    },
    body: JSON.stringify(workspace)
  })

  return response.json()
}
