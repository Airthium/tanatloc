/** @module API.Organization.Add */

import { INewOrganization } from '@/database/index.d'

import { call } from '@/api/call'

/**
 * Add
 * @param organization Organization
 * @returns New organization
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
