/** @namespace Lib.Organization */

import Crypto from 'crypto'

import OrganizationDB from '@/database/organization'
import {
  IDataBaseEntry,
  INewOrganization,
  IOrganization
} from '@/database/index.d'

import User from '../user'
import Group from '../group'
import Email from '../email'

import { IOrganizationWithData } from '../index.d'

/**
 * Add
 * @memberof Lib.Organization
 * @param {Object} user User `{ id }`
 * @param {Object} organization Organization `{ name }`
 * @returns {Object} Organization `{ id, name, owners }`
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
 * @memberof Lib.Organization
 * @param {string} id Id
 * @param {Array} data Data
 * @returns {Object} Organization `{ id, ...data }`
 */
const get = async (id: string, data: string[]): Promise<IOrganization> => {
  return OrganizationDB.get(id, data)
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

  const organizationWithData: IOrganizationWithData = { ...organization }

  // Owners
  if (organization?.owners) {
    organizationWithData.owners = await Promise.all(
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

  // Users
  if (organization?.users) {
    organizationWithData.users = await Promise.all(
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

  // Groups
  if (organization?.groups) {
    organizationWithData.groups = await Promise.all(
      organization.groups.map(async (group) => {
        const groupData = await Group.getWithData(group, ['name', 'users'])

        return {
          id: group,
          ...groupData
        }
      })
    )
  }

  return organizationWithData
}

/**
 * Get by user
 * @memberof Lib.Organization
 * @param {Object} user User `{ id }`
 * @param {Array} data Data
 * @returns {Array} Organizations
 */
const getByUser = async (
  user: { id: string },
  data: string[]
): Promise<IOrganizationWithData[]> => {
  const internalData = [...data]
  if (!internalData.includes('owners')) internalData.push('owners')
  if (!internalData.includes('users')) internalData.push('users')

  const organizations = await OrganizationDB.getAll(internalData)

  // Check user
  const userOrganizations = organizations.filter(
    (o) => o.owners?.includes(user.id) || o.users?.includes(user.id)
  )

  // Remove internal
  const returnedOrganization: IOrganizationWithData[] = userOrganizations.map(
    (o) => {
      const organization = {}
      data.forEach((d) => {
        organization[d] = o[d]
      })
      return organization
    }
  )

  // Users & groups data
  await Promise.all(
    returnedOrganization.map(async (organization: IOrganizationWithData) => {
      // Owners
      organization.owners &&
        (organization.owners = await Promise.all(
          organization.owners.map(async (o) => {
            const ownerData = await User.getWithData(o, [
              'firstname',
              'lastname',
              'email',
              'avatar'
            ])
            return {
              id: o,
              ...ownerData
            }
          })
        ))

      // Users
      organization.users &&
        (organization.users = await Promise.all(
          organization.users.map(async (u) => {
            const userData = await User.getWithData(u, [
              'firstname',
              'lastname',
              'email',
              'avatar'
            ])
            return {
              id: u,
              ...userData
            }
          })
        ))

      // Groups
      organization.groups &&
        (organization.groups = await Promise.all(
          organization.groups.map(async (g) => {
            const groupData = await Group.get(g, ['name', 'users'])
            return {
              id: g,
              ...groupData
            }
          })
        ))
    })
  )

  return returnedOrganization
}

/**
 * Update
 * @memberof Lib.Organization
 * @param {Object} organization Organization
 * @param {Array} data Data
 * @param {string} ownerId Owner id
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
 * @memberof Lib.Organization
 * @param {Object} organization Organization `{ id }`
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
