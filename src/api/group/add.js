import Caller from '@/api/call'

/**
 * Add group
 * @memberof module:api/group
 * @param {Object} organization Organization { id }
 * @param {Object} group Group { name, users }
 */
const add = async (organization, group) => {
  return Caller.call('/api/group', {
    method: 'POST',
    body: JSON.stringify({ organization, group })
  })
}

export default add
