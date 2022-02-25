/** @module Database.Organization.Get */

import { IOrganization } from '../index.d'

import { tables } from '@/config/db'

import { getter } from '..'

/**
 * Get
 * @param id Organization id
 * @param data Data
 * @returns Organization
 */
export const get = async (
  id: string,
  data: Array<string>
): Promise<IOrganization> => {
  const response = await getter(tables.ORGANIZATIONS, id, data)

  const organization = response.rows[0]
  organization && (organization.id = id)

  return organization
}
