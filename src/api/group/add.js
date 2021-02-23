import Caller from '@/api/call'

/**
 * Add group
 * @memberof module:src/api/group
 * @param {Object} group Group
 */
const add = async (group) => {
  return Caller.call('/api/group', {
    method: 'POST',
    body: JSON.stringify(group)
  })
}

export default add
