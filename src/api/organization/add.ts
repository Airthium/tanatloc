import { INewOrganization } from '@/database/index.d'

import { call } from '@/api/call'

/**
 * Add organization
 * @memberof API.Organization
 * @param {Object} organization Organization `{ name }`
 * @returns {Object} Organization `{ id, name, owners }`
 */
export const add = async (organization: {
  name: string
}): Promise<INewOrganization> => {
  const response = await call('/api/organization', {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    },
    body: JSON.stringify(organization)
  })

  return response.json()
}
