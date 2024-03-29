/** @module Lib.Organization */

import Crypto from 'crypto'

import { IDataBaseEntry } from '@/database/index.d'
import {
  IGroupWithData,
  IOrganizationGet,
  IOrganizationWithData,
  IUserWithData
} from '../index.d'

import OrganizationDB, {
  INewOrganization,
  TOrganizationGet
} from '@/database/organization'
import { TUserGet } from '@/database/user'

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
const get = async <T extends TOrganizationGet>(
  id: string,
  data: T
): Promise<IOrganizationGet<T> | undefined> => {
  const organizationData = await OrganizationDB.get(id, data)
  if (!organizationData) return

  if (data.includes('owners') && !organizationData.owners)
    organizationData.owners = []

  if (data.includes('pendingowners') && !organizationData.pendingowners)
    organizationData.pendingowners = []

  if (data.includes('users') && !organizationData.users)
    organizationData.users = []

  if (data.includes('pendingusers') && !organizationData.pendingusers)
    organizationData.pendingusers = []

  if (data.includes('groups') && !organizationData.groups)
    organizationData.groups = []

  return organizationData as IOrganizationGet<T>
}

/**
 * Get users data
 * @param users Users
 * @param partial Partial data for pending owners
 * @returns Owners data
 */
const getUsersData = async (
  users: string[],
  partial?: boolean
): Promise<IUserWithData[]> => {
  const usersData = []
  for (const user of users) {
    const data: TUserGet = ['email']
    if (!partial) {
      data.push(
        'firstname',
        'lastname',
        'avatar',
        'workspaces',
        'projects',
        'usermodels'
      )
    }
    const userData = await User.getWithData(user, data)
    if (!userData) continue

    usersData.push(userData)
  }
  return usersData as unknown as IUserWithData[]
}

/**
 * Get groups data
 * @param groups Groups
 * @returns Groups data
 */
const getGroupsData = async (groups: string[]): Promise<IGroupWithData[]> => {
  const groupsData = []
  for (const group of groups) {
    const groupData = await Group.getWithData(group, ['name', 'users'])
    if (!groupData) continue

    groupsData.push(groupData)
  }
  return groupsData as unknown as IGroupWithData[]
}

/**
 * Get with data
 * @param id Id
 * @param data Data
 * @returns Organization
 */
const getWithData = async <T extends TOrganizationGet>(
  id: string,
  data: T
): Promise<IOrganizationWithData<T> | undefined> => {
  const organization = await get(id, data)
  if (!organization) return

  const {
    owners,
    pendingowners,
    users,
    pendingusers,
    groups,
    ...organizationData
  } = organization

  // Owners
  let ownersData
  if (owners) {
    ownersData = await getUsersData(owners)
  }

  let pendingownersData
  if (pendingowners) {
    pendingownersData = await getUsersData(pendingowners, true)
  }

  // Users
  let usersData
  if (users) {
    usersData = await getUsersData(users)
  }

  let pendingusersData
  if (pendingusers) {
    pendingusersData = await getUsersData(pendingusers, true)
  }

  // Groups
  let groupsData
  if (groups) {
    groupsData = await getGroupsData(groups)
  }

  return {
    ...organizationData,
    owners: ownersData,
    pendingowners: pendingownersData,
    users: usersData,
    pendingusers: pendingusersData,
    groups: groupsData
  } as IOrganizationWithData<T>
}

/**
 * Get all
 * @param data Data
 * @returns Organizations
 */
const getAll = async <T extends TOrganizationGet>(
  data: T
): Promise<IOrganizationGet<T>[]> => {
  const organizations = await OrganizationDB.getAll(data)

  if (data.includes('owners'))
    organizations.forEach((organization) => {
      !organization.owners && (organization.owners = [])
    })

  if (data.includes('pendingowners'))
    organizations.forEach((organization) => {
      !organization.pendingowners && (organization.pendingowners = [])
    })

  if (data.includes('users'))
    organizations.forEach((organization) => {
      !organization.users && (organization.users = [])
    })

  if (data.includes('pendingusers'))
    organizations.forEach((organization) => {
      !organization.pendingusers && (organization.pendingusers = [])
    })

  if (data.includes('groups'))
    organizations.forEach((organization) => {
      !organization.groups && (organization.groups = [])
    })

  return organizations as IOrganizationGet<T>[]
}

/**
 * Get by user
 * @param user User
 * @param data Data
 * @returns Organizations
 */
const getByUser = async <T extends TOrganizationGet>(
  user: { id: string },
  data: T
): Promise<IOrganizationWithData<T>[]> => {
  const internalData: TOrganizationGet = [
    'owners',
    'pendingowners',
    'users',
    'pendingusers'
  ]

  // Get all
  const organizations = await getAll(internalData)

  // Check access
  const accessOrganizations = organizations.filter((organization) => {
    return (
      organization.owners.includes(user.id) ||
      organization.pendingowners.includes(user.id) ||
      organization.users.includes(user.id) ||
      organization.pendingusers.includes(user.id)
    )
  })

  // Get data
  const userOrganizations: IOrganizationWithData<T>[] = []
  for (const organization of accessOrganizations) {
    const userOrganization = await getWithData(organization.id, data)
    if (!userOrganization) continue

    userOrganizations.push(userOrganization)
  }

  return userOrganizations
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
    if (!owner) return

    // Check for emails
    for (const d of data) {
      if (
        d.type === 'array' &&
        d.method === 'append' &&
        (d.key === 'owners' || d.key === 'users')
      ) {
        const email = d.value
        const user = await User.getBy(email, ['id'], 'email')

        if (user) d.value = user.id
        else {
          // Create user
          const newUser = await User.add({
            email: email,
            password: Crypto.randomBytes(12).toString('hex')
          })
          d.value = newUser.id
        }

        // Send email
        await Email.invite(email, {
          email: owner.email,
          firstname: owner.firstname,
          lastname: owner.lastname
        })

        d.key = 'pending' + d.key
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
  if (!organizationData) return

  // Del organization from owners
  for (const owner of organizationData.owners) {
    await User.update({ id: owner }, [
      {
        key: 'organizations',
        type: 'array',
        method: 'remove',
        value: organization.id
      }
    ])
  }

  // Del organization from users
  for (const user of organizationData.users) {
    await User.update({ id: user }, [
      {
        key: 'organizations',
        type: 'array',
        method: 'remove',
        value: organization.id
      }
    ])
  }

  // Del groups
  for (const group of organizationData.groups) {
    await Group.del({ id: group })
  }

  // Delete organization
  await OrganizationDB.del(organization)
}

/**
 * Accept invitation
 * @param organization Organization
 * @param user User
 */
const accept = async (organization: { id: string }, user: { id: string }) => {
  // Data
  const organizationData = await get(organization.id, [
    'pendingowners',
    'pendingusers'
  ])
  if (!organizationData) return

  // Check if user is pending
  const pendingOwner = organizationData.pendingowners?.includes(user.id)
  const pendingUser = organizationData.pendingusers?.includes(user.id)

  if (!pendingOwner && !pendingUser)
    throw new Error('User has no invitation in this organization')

  // Update organization
  await update(organization, [
    {
      key: pendingOwner ? 'pendingowners' : 'pendingusers',
      type: 'array',
      method: 'remove',
      value: user.id
    },
    {
      key: pendingOwner ? 'owners' : 'users',
      type: 'array',
      method: 'append',
      value: user.id
    }
  ])
}

/**
 * Decline invitation
 * @param organization Organization
 * @param user User
 */
const decline = async (organization: { id: string }, user: { id: string }) => {
  // Data
  const organizationData = await get(organization.id, [
    'pendingowners',
    'pendingusers'
  ])
  if (!organizationData) return

  // Check if user is pending
  const pendingOwner = organizationData.pendingowners?.includes(user.id)
  const pendingUser = organizationData.pendingusers?.includes(user.id)

  if (!pendingOwner && !pendingUser)
    throw new Error('User has no invitation in this organization')

  // Update organization
  await update(organization, [
    {
      key: pendingOwner ? 'pendingowners' : 'pendingusers',
      type: 'array',
      method: 'remove',
      value: user.id
    }
  ])
}

/**
 * Quit organization
 * @param organization Organization
 * @param user User
 */
const quit = async (organization: { id: string }, user: { id: string }) => {
  // Data
  const organizationData = await get(organization.id, ['users'])
  if (!organizationData) return

  // Check user
  if (!organizationData.users?.includes(user.id))
    throw new Error('User is not in this organization')

  // Update organization
  await update(organization, [
    {
      key: 'users',
      type: 'array',
      method: 'remove',
      value: user.id
    }
  ])
}

const Organization = {
  add,
  get,
  getAll,
  getWithData,
  getByUser,
  update,
  del,
  accept,
  decline,
  quit
}
export default Organization
