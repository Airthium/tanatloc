import Caller from '@/api/call'

/**
 * Add organization
 * @memberof module:api/organization
 * @param {Object} organization Organization { name }
 */
const add = async (organization) => {
  return Caller.call('/api/organization', {
    method: 'POST',
    body: JSON.stringify(organization)
  })
}

export default add
