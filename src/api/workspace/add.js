import Caller from '@/api/call'

/**
 * Add a workspace
 * @memberof module:api/workspace
 * @param {Object} workspace Workspace { name }
 */
const add = async (workspace) => {
  return Caller.call('/api/workspace', {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    },
    body: JSON.stringify(workspace)
  })
}

export default add
