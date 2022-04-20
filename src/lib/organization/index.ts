/** @module Lib.Organization */

import Crypto from 'crypto'

import { IDataBaseEntry } from '@/database/index.d'
import {
  IGroupWithData,
  IOrganizationWithData,
  IUserWithData
} from '../index.d'

import OrganizationDB, {
  INewOrganization,
  IOrganization,
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
): Promise<IOrganization<T>> => {
  const organizationData = await OrganizationDB.get(id, data)

  if (data.includes('pendingowners') && !organizationData.pendingowners)
    organizationData.pendingowners = []

  if (data.includes('users') && !organizationData.users)
    organizationData.users = []

  if (data.includes('pendingusers') && !organizationData.pendingusers)
    organizationData.pendingusers = []

  if (data.includes('groups') && !organizationData.groups)
    organizationData.groups = []

  return organizationData
}

/**
 * Get owners data
 * @param organization Organization
 * @param partial Partial data for pending owners
 * @returns Owners data
 */
const getOwnersData = async (
  organization: { owners: string[] },
  partial?: boolean
): Promise<IUserWithData[]> => {
  return Promise.all(
    organization.owners.map(async (owner) => {
      const data: TUserGet = ['email']
      if (!partial) {
        data.push('firstname', 'lastname', 'avatar')
      }
      const ownerData = await User.getWithData(owner, data)

      return {
        ...ownerData,
        id: owner
      }
    })
  )
}

/**
 * Get users data
 * @param organization Organization
 * @param partial Partial data for pending users
 * @returns Users data
 */
const getUsersData = async (
  organization: { users: string[] },
  partial?: boolean
): Promise<IUserWithData[]> => {
  return Promise.all(
    organization.users.map(async (user) => {
      const data: TUserGet = ['email']
      if (!partial) {
        data.push('firstname', 'lastname', 'avatar')
      }
      const userData = await User.getWithData(user, data)

      return {
        ...userData,
        id: user
      }
    })
  )
}

/**
 * Get groups data
 * @param organization Organization
 * @returns Groups data
 */
const getGroupsData = async (organization: {
  groups: string[]
}): Promise<IGroupWithData[]> => {
  return Promise.all(
    organization.groups.map(async (group) => {
      const groupData = await Group.getWithData(group, ['name', 'users'])

      return {
        ...groupData,
        id: group
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
  data: TOrganizationGet
): Promise<IOrganizationWithData> => {
  const organization = await get(id, data)

  const {
    owners,
    pendingowners,
    users,
    pendingusers,
    groups,
    ...organizationData
  } = { ...organization }
  const organizationWithData: IOrganizationWithData = { ...organizationData }

  // Owners
  if (owners) {
    organizationWithData.owners = await getOwnersData({ owners })
  }

  if (pendingowners) {
    organizationWithData.pendingowners = await getOwnersData(
      { owners: pendingowners },
      true
    )
  }

  // Users
  if (users) {
    organizationWithData.users = await getUsersData({ users })
  }

  if (pendingusers) {
    organizationWithData.pendingusers = await getUsersData(
      { users: pendingusers },
      true
    )
  }

  // Groups
  if (groups) {
    organizationWithData.groups = await getGroupsData({ groups })
  }

  return organizationWithData
}

/**
 * Set missing data
 * @param organizations Organizations
 * @param data Data
 */
const setMissingData = (
  organizations: IOrganization<
    (
      | 'name'
      | 'owners'
      | 'pendingowners'
      | 'users'
      | 'pendingusers'
      | 'groups'
    )[]
  >[],
  data: string[]
): void => {
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
}

/**
 * Get by user
 * @param user User
 * @param data Data
 * @returns Organizations
 */
const getByUser = async (
  user: { id: string },
  data: TOrganizationGet
): Promise<IOrganizationWithData[]> => {
  const internalData = [...data]
  if (!internalData.includes('owners')) internalData.push('owners')
  if (!internalData.includes('users')) internalData.push('users')

  const organizations = await OrganizationDB.getAll(internalData)

  setMissingData(organizations, data)

  // Check user & data
  const userOrganizations = await Promise.all(
    organizations.map(async (organization) => {
      // Check user
      if (
        !organization.owners?.includes(user.id) &&
        !organization.pendingowners?.includes(user.id) &&
        !organization.users?.includes(user.id) &&
        !organization.pendingusers?.includes(user.id)
      )
        return

      const {
        owners,
        pendingowners,
        users,
        pendingusers,
        groups,
        ...organizationData
      } = { ...organization }

      const organizationWithData: IOrganizationWithData = {
        ...organizationData
      }

      // Owners data
      if (data.includes('owners') && owners)
        organizationWithData.owners = await getOwnersData({ owners })

      // Pending owners data (partial)
      if (data.includes('pendingowners') && pendingowners)
        organizationWithData.pendingowners = await getOwnersData(
          { owners: pendingowners },
          true
        )

      // Users data
      if (data.includes('users') && users)
        organizationWithData.users = await getUsersData({ users })

      // Pending users data (partial)
      if (data.includes('pendingusers') && pendingusers)
        organizationWithData.pendingusers = await getUsersData(
          {
            users: pendingusers
          },
          true
        )

      // Group data
      if (data.includes('groups') && groups)
        organizationWithData.groups = await getGroupsData({ groups })

      return organizationWithData
    })
  )

  return userOrganizations.filter((o) => o) as IOrganization[]
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

  // Check if user is pending
  const pendingOwner = organizationData.pendingowners?.includes(user.id)
  const pendingUser = organizationData.pendingusers?.includes(user.id)

  if (!pendingOwner && !pendingUser)
    throw new Error('User has no invitation in this organization')

  // Update organization
  await update(organization, [
    {
      key: !!pendingOwner ? 'pendingowners' : 'pendingusers',
      type: 'array',
      method: 'remove',
      value: user.id
    },
    {
      key: !!pendingOwner ? 'owners' : 'users',
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

  // Check if user is pending
  const pendingOwner = organizationData.pendingowners?.includes(user.id)
  const pendingUser = organizationData.pendingusers?.includes(user.id)

  if (!pendingOwner && !pendingUser)
    throw new Error('User has no invitation in this organization')

  // Update organization
  await update(organization, [
    {
      key: !!pendingOwner ? 'pendingowners' : 'pendingusers',
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
  getWithData,
  getByUser,
  update,
  del,
  accept,
  decline,
  quit
}
export default Organization
