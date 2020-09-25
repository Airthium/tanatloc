/** @module src/lib/workspace */

import {
  add as dBadd,
  get as dBget,
  update as updatedB,
  del as dBdel
} from '../database/workspace'

import { get as getUser, update as updateUser } from './user'

/**
 * Add workspace
 * @param {Object} user User { id }
 * @param {Object} workspace Workspace { name }
 */
const add = async (user, { name }) => {
  const workspace = await dBadd(user, { name })

  // Add workspace to user
  await updateUser(user, {
    data: [
      {
        type: 'array',
        method: 'append',
        key: 'workspaces',
        value: workspace.id
      }
    ]
  })

  return workspace
}

/**
 *
 * @param {string} id Id
 * @param {Array} data Data [{ key, value, ... }]
 */
const get = async (id, data) => {
  const workspace = await dBget(id, data)
  return workspace
}

/**
 * Get workspaces by user
 * @param {Object} user User { id }
 */
const getByUser = async ({ id }) => {
  const user = await getUser(id, ['workspaces'])

  const workspaces = await Promise.all(
    user.workspaces.map(async (workspace) => {
      const data = await get(workspace, ['name', 'owners', 'users', 'projects'])
      return {
        ...data,
        id: workspace
      }
    })
  )

  return workspaces
}

/**
 * Update workspace
 * @param {Object} data { workspace: { id }, data: [{ type, method, key, value }]}
 */
const update = async ({ workspace: { id }, data }) => {
  await updatedB({ workspace: { id }, data })
}

/**
 *
 * @param {Object} user User { id }
 * @param {Object} workspace Workspace { id }
 */
const del = async ({ id }, workspace) => {
  await dBdel(workspace)

  // Delete workspace reference in user
  await updateUser(
    { id },
    {
      data: [
        {
          type: 'array',
          method: 'remove',
          key: 'workspaces',
          value: workspace.id
        }
      ]
    }
  )
}

export { add, get, getByUser, update, del }
