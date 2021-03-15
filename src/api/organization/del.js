import Caller from '@/api/call'

/**
 * Delete group
 * @memberof module:api/organization
 * @param {Object} organization Organization
 */
const del = async (organization) => {
  return Caller.call('/api/organization', {
    method: 'DELETE',
    body: JSON.stringify(organization)
  })
}

export default del
