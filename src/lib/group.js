import GroupDB from '@/database/group'

import User from './user'

/**
 * Add group
 * @param {Object} group Group
 */
const add = async (group) => {
  return GroupDB.add(group)
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
  await GroupDB.update(group, data)
}

/**
 * Delete group
 * @param {Object} group Group { id }
 */
const del = async (group) => {
  await GroupDB.del(group)
}

export default { add, getAll, update, del }
