/** @module Database.Organization.Get */

import { tables } from '@/config/db'

import { getter } from '..'

export type TOrganizationGet = (
  | 'name'
  | 'owners'
  | 'pendingowners'
  | 'users'
  | 'pendingusers'
  | 'groups'
)[]

export interface IOrganization<T> {
  id: string
  name: T extends ['name'] ? string : never
  owners: T extends ['owners'] ? string[] : never[]
  pendingowners?: T extends ['pendingowners'] ? string[] : never[]
  users?: T extends ['users'] ? string[] : never[]
  pendingusers?: T extends ['pendingusers'] ? string[] : never[]
  groups?: T extends ['groups'] ? string[] : never[]
}

/**
 * Get
 * @param id Organization id
 * @param data Data
 * @returns Organization
 */
export const get = async <T extends TOrganizationGet>(
  id: string,
  data: T
): Promise<IOrganization<T>> => {
  const response = await getter(tables.ORGANIZATIONS, id, data)

  const organization = response.rows[0]
  organization && (organization.id = id)

  return organization
}
