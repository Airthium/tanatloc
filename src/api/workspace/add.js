import Caller from '@/api/call'

/**
 * Add
 * @memberof API.Workspace
 * @param {Object} workspace Workspace `{ name }`
 * @returns {Object} Workspace `{ id, name, owners }`
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
