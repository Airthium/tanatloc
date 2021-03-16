import GroupDB from '@/database/group'

import User from '../user'
import Organization from '../organization'

/**
 * Add group
 * @param {Object} organization Organization { id }
 * @param {Object} group Group
 */
const add = async (organization, { name, users }) => {
  // Add group
  const group = await GroupDB.add(organization, { name, users })
  console.log(group)

  // Add group to organization
  Organization.update(organization, [
    {
      key: 'groups',
      type: 'array',
      method: 'append',
      value: group.id
    }
  ])

  return group
}

/**
 * Get
 * @param {string} id Id
 * @param {Array} data Data
 */
const get = async (id, data) => {
  const group = await GroupDB.get(id, data)

  // Users data
  group.users &&
    (group.users = await Promise.all(
      group.users.map(async (user) => {
        const userData = await User.get(user, [
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
    ))

  return group
}

/**
 * Get all users
 * @param {Array} data Data
 */
const getAll = async (data) => {
  // Get groups
  const groups = await GroupDB.getAll(data)

  // Users data
  await Promise.all(
    groups.map(async (group, index) => {
      if (group.users) {
        const users = await Promise.all(
          group.users.map(async (user) => {
            const userData = await User.get(user, [
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
        groups[index].users = users
      }
    })
  )

  return groups
}

const getByOrganization = async (id, data) => {
  // Get organization
  const organization = await Organization.get(id, ['groups'])

  // Get groups
  const groups =
    organization.groups &&
    (await Promise.all(
      organization.groups.map(async (group) => await get(group, data))
    ))

  return groups
}

/**
 * Update group
 * @param {Object} group Group { id }
 * @param {Array} data Data
 */
const update = async (group, data) => {
  // // Get data
  // const groupData = await get(group.id, ['users'])

  // // Check users
  // const usersUpdate = data.find((d) => d.key === 'users' && !d.type)
  // if (usersUpdate) {
  //   // Deleted users
  //   const deleted = groupData.users.filter(
  //     (u) => !usersUpdate.value.includes(u)
  //   )

  //   await Promise.all(
  //     deleted.map(async (user) => {
  //       await User.update({ id: user }, [
  //         {
  //           key: 'groups',
  //           type: 'array',
  //           method: 'remove',
  //           value: group.id
  //         }
  //       ])
  //     })
  //   )

  //   // Added users
  //   const added = usersUpdate.value.filter((u) => !groupData.users.includes(u))
  //   await Promise.all(
  //     added.map(async (user) => {
  //       await User.update({ id: user }, [
  //         {
  //           key: 'groups',
  //           type: 'array',
  //           method: 'append',
  //           value: group.id
  //         }
  //       ])
  //     })
  //   )
  // }

  // Update group
  await GroupDB.update(group, data)
}

/**
 * Delete group
 * @param {Object} group Group { id }
 */
const del = async (group) => {
  // Get data
  const groupData = await get(group.id, ['organization'])

  // Del group from organization
  await Organization.update({ id: groupData.organization }, [
    {
      key: 'groups',
      type: 'array',
      method: 'remove',
      value: group.id
    }
  ])

  // Delete group
  await GroupDB.del(group)
}

export default { add, get, getAll, getByOrganization, update, del }
