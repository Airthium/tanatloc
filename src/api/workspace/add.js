import { call } from '../call'

/**
 * Add a workspace
 * @memberof module:src/api/workspace
 * @param {Object} workspace Workspace { name }
 */
const add = async (workspace) => {
  const res = await call('/api/workspace', {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    },
    body: JSON.stringify(workspace)
  })

  return res
}

export default add
