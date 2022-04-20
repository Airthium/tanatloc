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

export type TOrganizationGetName = 'name'[]
export type TOrganizationGetOwners = 'owners'[]
export type TOrganizationGetPendingowners = 'pendingowners'[]
export type TOrganizationGetUsers = 'users'[]
export type TOrganizationGetPendingusers = 'pendingusers'[]
export type TOrganizationGetGroups = 'groups'[]

export interface IOrganization<T = []> {
  id: string
  name: TOrganizationGetName extends T ? string : never
  owners: TOrganizationGetOwners extends T ? string[] : never[]
  pendingowners?: TOrganizationGetPendingowners extends T ? string[] : never[]
  users?: TOrganizationGetUsers extends T ? string[] : never[]
  pendingusers?: TOrganizationGetPendingusers extends T ? string[] : never[]
  groups?: TOrganizationGetGroups extends T ? string[] : never[]
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
