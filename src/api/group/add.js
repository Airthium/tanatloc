import Caller from '@/api/call'

/**
 * Add group
 * @memberof API.Group
 * @param {Object} organization Organization `{ id }`
 * @param {Object} group Group `{ name, users }`
 * @returns {Object} Group `{ id, name, users, organization }`
 */
const add = async (organization, group) => {
  return Caller.call('/api/group', {
    method: 'POST',
    body: JSON.stringify({ organization, group })
  })
}

export default add
