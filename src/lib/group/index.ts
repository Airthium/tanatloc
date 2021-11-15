/** @namespace Lib.Group */

import GroupDB from '@/database/group'
import { INewGroup, IGroup, IUser, IDataBaseEntry } from '@/database/index.d'

import User from '../user'
import Workspace from '../workspace'
import Project from '../project'
import Organization from '../organization'

/**
 * Add
 * @memberof Lib.Group
 * @param {Object} organization Organization `{ id }`
 * @param {Object} group Group `{ name, users }`
 * @returns {Object} Group `{ id, name, users, organization }`
 */
const add = async (
  organization: { id: string },
  group: { name: string; users: Array<string> }
): Promise<INewGroup> => {
  // Add group
  const newGroup = await GroupDB.add(organization, group)

  //TODO bug here!

  // Add group to organization
  Organization.update(organization, [
    {
      key: 'groups',
      type: 'array',
      method: 'append',
      value: group.id
    }
  ])

  return newGroup
}

/**
 * Get
 * @memberof Lib.Group
 * @param {string} id Id
 * @param {Array} data Data
 * @param {boolean} [withData=true] With data
 * @returns {Object} Group `{ id, ...data }`
 */
const get = async (
  id: string,
  data: Array<string>,
  withData: boolean = true
): Promise<IGroup & { users?: IUser }> => {
  const groupData = await GroupDB.get(id, data)

  if (withData && groupData?.users)
    groupData.users = await Promise.all(
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
    )

  return groupData
}

/**
 * Get all
 * @memberof Lib.Group
 * @param {Array} data Data
 * @return {Array} Groups
 */
const getAll = async (
  data: Array<string>
): Promise<Array<IGroup & { users?: IUser }>> => {
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

/**
 * Get by organization
 * @memberof Lib.Group
 * @param {string} id Organization id
 * @param {Array} data Data
 * @returns {Array} Groups TODO complete TS type
 */
const getByOrganization = async (
  id: string,
  data: Array<string>
): Promise<Array<any>> => {
  // Get organization
  const organization = await Organization.get(id, ['groups'])

  // Get groups
  return (
    organization.groups &&
    Promise.all(
      organization.groups.map(async (group) => {
        const groupData = await get(group, data)

        return {
          id: group,
          ...groupData
        }
      })
    )
  )
}

/**
 * Update
 * @memberof Lib.Group
 * @param {Object} group Group `{ id }`
 * @param {Array} data Data
 */
const update = async (
  group: { id: string },
  data: IDataBaseEntry[]
): Promise<void> => {
  await GroupDB.update(group, data)
}

/**
 * Delete
 * @memberof Lib.Group
 * @param {Object} group Group `{ id }`
 */
const del = async (group: { id: string }): Promise<void> => {
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

const Group = { add, get, getAll, getByOrganization, update, del }
export default Group
