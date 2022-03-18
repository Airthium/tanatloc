/** @module Lib.Organization */

import Crypto from 'crypto'

import {
  IDataBaseEntry,
  INewOrganization,
  IOrganization
} from '@/database/index.d'
import {
  IGroupWithData,
  IOrganizationWithData,
  IUserWithData
} from '../index.d'

import OrganizationDB from '@/database/organization'

import User from '../user'
import Group from '../group'
import Email from '../email'

/**
 * Add
 * @param user User
 * @param organization Organization
 * @returns New organization
 */
const add = async (
  user: { id: string },
  organization: { name: string }
): Promise<INewOrganization> => {
  // Add organization
  const newOrganization = await OrganizationDB.add({
    name: organization.name,
    owners: [user.id]
  })

  // Add organization to user
  await User.update(user, [
    {
      key: 'organizations',
      type: 'array',
      method: 'append',
      value: newOrganization.id
    }
  ])

  return newOrganization
}

/**
 * Get
 * @param id Id
 * @param data Data
 * @returns Organization
 */
const get = async (id: string, data: string[]): Promise<IOrganization> => {
  const organizationData = await OrganizationDB.get(id, data)

  if (data.includes('owners') && !organizationData.owners)
    organizationData.owners = []

  if (data.includes('users') && !organizationData.users)
    organizationData.users = []

  if (data.includes('groups') && !organizationData.groups)
    organizationData.groups = []

  return organizationData
}

/**
 * Get owners data
 * @param organization Organization
 * @returns Owners data
 */
const getOwnersData = async (
  organization: IOrganization | { owners: string[] }
): Promise<IUserWithData[]> => {
  return Promise.all(
    organization.owners.map(async (owner) => {
      const ownerData = await User.getWithData(owner, [
        'firstname',
        'lastname',
        'email',
        'avatar'
      ])

      return {
        id: owner,
        ...ownerData
      }
    })
  )
}

/**
 * Get users data
 * @param organization Organization
 * @returns Users data
 */
const getUsersData = async (
  organization: IOrganization | { users: string[] }
): Promise<IUserWithData[]> => {
  return Promise.all(
    organization.users.map(async (user) => {
      const userData = await User.getWithData(user, [
        'firstname',
        'lastname',
        'email',
        'avatar'
      ])

      return {
        id: user,
        ...userData
      }
    })
  )
}

/**
 * Get groups data
 * @param organization Organization
 * @returns Groups data
 */
const getGroupsData = async (
  organization: IOrganization | { groups: string[] }
): Promise<IGroupWithData[]> => {
  return Promise.all(
    organization.groups.map(async (group) => {
      const groupData = await Group.getWithData(group, ['name', 'users'])

      return {
        id: group,
        ...groupData
      }
    })
  )
}

/**
 * Get with data
 * @param id Id
 * @param data Data
 * @returns Organization
 */
const getWithData = async (
  id: string,
  data: string[]
): Promise<IOrganizationWithData> => {
  const organization = await get(id, data)

  const { owners, users, groups, ...organizationData } = { ...organization }
  const organizationWithData: IOrganizationWithData = { ...organizationData }

  // Owners
  if (owners) {
    organizationWithData.owners = await getOwnersData(organization)
  }

  // Users
  if (users) {
    organizationWithData.users = await getUsersData(organization)
  }

  // Groups
  if (groups) {
    organizationWithData.groups = await getGroupsData(organization)
  }

  return organizationWithData
}

/**
 * Get by user
 * @param user User
 * @param data Data
 * @returns Organizations
 */
const getByUser = async (
  user: { id: string },
  data: string[]
): Promise<IOrganizationWithData[]> => {
  const internalData = [...data]
  if (!internalData.includes('owners')) internalData.push('owners')
  if (!internalData.includes('users')) internalData.push('users')

  const organizations = await OrganizationDB.getAll(internalData)

  // Check user & data
  const userOrganizations = await Promise.all(
    organizations.map(async (organization) => {
      // Check user
      if (
        !organization.owners?.includes(user.id) &&
        !organization.users?.includes(user.id)
      )
        return

      const { owners, users, groups, ...organizationData } = { ...organization }

      const organizationWithData: IOrganizationWithData = {
        ...organizationData
      }

      // Owner data
      if (data.includes('owners') && owners)
        organizationWithData.owners = await getOwnersData({ owners })

      if (data.includes('groups') && users)
        organizationWithData.users = await getUsersData({ users })

      if (groups) organizationWithData.groups = await getGroupsData({ groups })

      return organizationWithData
    })
  )

  return userOrganizations.filter((o) => o)
}

/**
 * Update
 * @param organization Organization
 * @param data Data
 * @param ownerId Owner id
 */
const update = async (
  organization: { id: string },
  data: IDataBaseEntry[],
  ownerId?: string
) => {
  if (ownerId) {
    // Get owner
    const owner = await User.get(ownerId, ['firstname', 'lastname', 'email'])

    // Check for emails
    for (const d of data) {
      if (
        d.type === 'array' &&
        d.method === 'append' &&
        (d.key === 'owners' || d.key === 'users')
      ) {
        const email = d.value
        let user = await User.getBy(email, ['id'], 'email')

        if (user) d.value = user.id
        else {
          // Create user
          user = await User.add({
            email: email,
            password: Crypto.randomBytes(12).toString('hex')
          })
          d.value = user.id
        }

        // Send email
        await Email.invite(email, {
          email: owner.email,
          firstname: owner.firstname,
          lastname: owner.lastname
        })

        await User.update({ id: user.id }, [
          {
            key: 'organizations',
            type: 'array',
            method: 'append',
            value: organization.id
          }
        ])
      }
    }
  }

  // Update
  await OrganizationDB.update(organization, data)
}

/**
 * Delete
 * @param organization Organization
 */
const del = async (organization: { id: string }): Promise<void> => {
  // Get data
  const organizationData = await get(organization.id, [
    'owners',
    'users',
    'groups'
  ])

  // Del organization from owners
  organizationData.owners &&
    (await Promise.all(
      organizationData.owners.map(async (owner) => {
        await User.update({ id: owner }, [
          {
            key: 'organizations',
            type: 'array',
            method: 'remove',
            value: organization.id
          }
        ])
      })
    ))

  // Del organization from users
  organizationData.users &&
    (await Promise.all(
      organizationData.users.map(async (user) => {
        await User.update({ id: user }, [
          {
            key: 'organizations',
            type: 'array',
            method: 'remove',
            value: organization.id
          }
        ])
      })
    ))

  // Del groups
  organizationData.groups &&
    (await Promise.all(
      organizationData.groups.map(async (group) => {
        await Group.del({ id: group })
      })
    ))

  // Delete organization
  await OrganizationDB.del(organization)
}

const Organization = { add, get, getWithData, getByUser, update, del }
export default Organization
