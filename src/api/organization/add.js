import { call } from '@/api/call'

/**
 * Add organization
 * @memberof API.Organization
 * @param {Object} organization Organization `{ name }`
 * @returns {Object} Organization `{ id, name, owners }`
 */
const add = async (organization) => {
  return call('/api/organization', {
    method: 'POST',
    body: JSON.stringify(organization)
  })
}

export default add
