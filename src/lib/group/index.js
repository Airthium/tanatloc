/** @module lib/group */

import GroupDB from '@/database/group'

import User from '../user'
import Workspace from '../workspace'
import Project from '../project'
import Organization from '../organization'

/**
 * Add group
 * @param {Object} organization Organization { id }
 * @param {Object} group Group
 */
const add = async (organization, { name, users }) => {
  // Add group
  const group = await GroupDB.add(organization, { name, users })

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
  return GroupDB.get(id, data)
}

/**
 * Get (with auto-fill users data)
 * @param {string} id Id
 * @param {Array} data Data
 */
const getWithFill = async (id, data) => {
  const groupData = await get(id, data)

  groupData.users &&
    (groupData.users = await Promise.all(
      groupData.users.map(async (user) => {
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

  return groupData
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
  return (
    organization.groups &&
    (await Promise.all(
      organization.groups.map(async (group) => {
        const groupData = await get(group, data)

        groupData.users &&
          (groupData.users = await Promise.all(
            groupData.users.map(async (user) => {
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

        return {
          id: group,
          ...groupData
        }
      })
    ))
  )
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
  // Get data
  const groupData = await get(group.id, [
    'users',
    'workspaces',
    'projects',
    'organization'
  ])

  // Delete group from organization
  await Organization.update({ id: groupData.organization }, [
    {
      key: 'groups',
      type: 'array',
      method: 'remove',
      value: group.id
    }
  ])

  // Delete group from workspaces
  groupData.workspaces &&
    (await Promise.all(
      groupData.workspaces.map(async (workspace) => {
        await Workspace.update({ id: workspace }, [
          {
            key: 'groups',
            type: 'array',
            method: 'remove',
            value: group.id
          }
        ])
      })
    ))

  // Delete group from projects
  groupData.projects &&
    (await Promise.all(
      groupData.projects.map(async (project) => {
        await Project.update({ id: project }, [
          {
            key: 'groups',
            type: 'array',
            method: 'remove',
            value: group.id
          }
        ])
      })
    ))

  // Delete group
  await GroupDB.del(group)
}

export default { add, get: getWithFill, getAll, getByOrganization, update, del }
