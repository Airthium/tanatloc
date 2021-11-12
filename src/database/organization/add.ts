import { tables } from '@/config/db'

import query from '..'

type NewOrganization = {
  id: string
  name: string
  owners: Array<string>
}

/**
 * Add
 * @memberof Database.Organization
 * @param {Object} organization Organization `{ name, owners }`
 * @returns {Object} Organization `{ id, name, owners }`
 */
export const add = async (organization: {
  name: string
  owners: Array<string>
}): Promise<NewOrganization> => {
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
