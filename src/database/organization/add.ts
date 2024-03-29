/** @module Database.Organization.Add */

import { tables } from '@/config/db'

import { query } from '..'

export interface INewOrganization {
  id: string
  name: string
  owners: string[]
}

/**
 * Add
 * @param organization Organization
 * @returns New organization
 */
export const add = async (organization: {
  name: string
  owners: string[]
}): Promise<INewOrganization> => {
  const response = await query(
    'INSERT INTO ' +
      tables.ORGANIZATIONS +
      ' (name, owners) VALUES ($1, $2) RETURNING id',
    [organization.name, organization.owners]
  )

  const newOrganization = response.rows[0]
  newOrganization && (newOrganization.name = organization.name)
  newOrganization && (newOrganization.owners = organization.owners)

  return newOrganization
}
