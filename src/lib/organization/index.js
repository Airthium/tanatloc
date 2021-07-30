/** @module lib/organization */

import Crypto from 'crypto'

import OrganizationDB from '@/database/organization'

import User from '../user'
import Group from '../group'
import Email from '../email'

/**
 * Add organization
 * @param {Object} user User { id }
 * @param {Object} organization Organization { name }
 */
const add = async (user, organization) => {
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
 * @param {string} id Id
 * @param {Array} data Data
 */
const get = async (id, data) => {
  return OrganizationDB.get(id, data)
}

/**
 * Get by user
 * @param {Object} user User { id }
 * @param {Array} data Data []
 */
const getByUser = async (user, data) => {
  const internalData = [...data]
  if (!internalData.includes('owners')) internalData.push('owners')
  if (!internalData.includes('users')) internalData.push('users')

  const organizations = await OrganizationDB.getAll(internalData)

  // Check user
  const userOrganizations = organizations.filter(
    (o) => o.owners?.includes(user.id) || o.users?.includes(user.id)
  )

  // Remove internal
  const returnedOrganization = userOrganizations.map((o) => {
    const organization = {}
    data.forEach((d) => {
      organization[d] = o[d]
    })
    return organization
  })

  // Users & groups data
  await Promise.all(
    returnedOrganization.map(async (organization) => {
      // Owners
      organization.owners &&
        (organization.owners = await Promise.all(
          organization.owners.map(async (o) => {
            const ownerData = await User.get(o, [
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
            const userData = await User.get(u, [
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
 * @param {Object} organization Organization
 * @param {Array} data Data
 * @param {string} ownerId Owner id
 */
const update = async (organization, data, ownerId) => {
  // Get owner
  const owner = await User.get(ownerId, ['firstname', 'lastname', 'email'])

  // Check for emails
  const newData = await Promise.all(
    data.map(async (d) => {
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
        await Email.invite(email, owner)

        await User.update({ id: user.id }, [
          {
            key: 'organizations',
            type: 'array',
            method: 'append',
            value: organization.id
          }
        ])
      }

      return d
    })
  )

  // Update
  await OrganizationDB.update(organization, newData)
}

/**
 * Delete
 * @param {Object} organization Organization { id }
 */
const del = async (organization) => {
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
        await Group.del(group)
      })
    ))

  // Delete organization
  await OrganizationDB.del(organization)
}

const Organization = { add, get, getByUser, update, del }
export default Organization
