import GroupDB from '@/database/group'

import User from './user'

/**
 * Add group
 * @param {Object} group Group
 */
const add = async ({ name, users }) => {
  // Add group
  const group = await GroupDB.add({ name, users })

  // Add group to users
  await Promise.all(
    users.map((user) => {
      User.update({ id: user }, [
        {
          key: 'groups',
          type: 'array',
          method: 'append',
          value: group.id
        }
      ])
    })
  )

  return group
}

/**
 * Get
 * @param {string} id Id
 * @param {Array} data Data
 */
const get = async (id, data) => {
  return GroupDB.get(id, data)
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
    groups.map(async (group) => {
      await Promise.all(
        group.users.map(async (user, index) => {
          const userData = await User.get(user, [
            'firstname',
            'lastname',
            'email',
            'avatar'
          ])

          group.users[index] = {
            id: user,
            ...userData
          }
        })
      )
    })
  )

  return groups
}

/**
 * Update group
 * @param {Object} group Group { id }
 * @param {Array} data Data
 */
const update = async (group, data) => {
  // Get data
  const groupData = await get(group.id, ['users'])

  // Check users
  const usersUpdate = data.find((d) => d.key === 'users')
  if (usersUpdate) {
    // Deleted users
    const deleted = groupData.users.filter(
      (u) => !usersUpdate.value.includes(u)
    )

    await Promise.all(
      deleted.map(async (user) => {
        await User.update({ id: user }, [
          {
            key: 'groups',
            type: 'array',
            method: 'remove',
            value: group.id
          }
        ])
      })
    )

    // Added users
    const added = usersUpdate.value.filter((u) => !groupData.users.includes(u))
    await Promise.all(
      added.map(async (user) => {
        await User.update({ id: user }, [
          {
            key: 'groups',
            type: 'array',
            method: 'append',
            value: group.id
          }
        ])
      })
    )
  }

  // Update groupk
  await GroupDB.update(group, data)
}

/**
 * Delete group
 * @param {Object} group Group { id }
 */
const del = async (group) => {
  // Get data
  const groupData = await get(group.id, ['users'])

  // Del group to users
  await Promise.all(
    groupData.users.map(async (user) => {
      await User.update({ id: user }, [
        {
          key: 'groups',
          type: 'array',
          method: 'remove',
          value: group.id
        }
      ])
    })
  )

  // Delete group
  await GroupDB.del(group)
}

export default { add, getAll, update, del }
