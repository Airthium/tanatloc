import { tables } from '@/config/db'

import { getter } from '..'

export type Organization = {
  id: string
  name?: string
  owners?: Array<string>
  users?: Array<string>
  groups?: Array<string>
}

/**
 * Get
 * @memberof Database.Organization
 * @param {string} id Organization's id
 * @param {Array} data Data
 * @returns {Object} Organization `{ id, ...data }`
 */
export const get = async (
  id: string,
  data: Array<string>
): Promise<Organization> => {
  const response = await getter(tables.ORGANIZATIONS, id, data)

  const organization = response.rows[0]
  organization && (organization.id = id)

  return organization
}
