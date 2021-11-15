import { call } from '@/api/call'

/**
 * Delete group
 * @memberof API.Organization
 * @param {Object} organization Organization `{ id }`
 */
const del = async (organization) => {
  return call('/api/organization', {
    method: 'DELETE',
    body: JSON.stringify(organization)
  })
}

export default del
