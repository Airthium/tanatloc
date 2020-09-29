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
  // Add workspace
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

  // Return
  return workspace
}

/**
 * Get workspace
 * @param {string} id Id
 * @param {Array} data Data
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
  // Get workspaces'ids
  const user = await getUser(id, ['workspaces'])

  // Get workspaces data
  const workspaces = await Promise.all(
    user.workspaces.map(async (workspace) => {
      const data = await get(workspace, ['name', 'owners', 'users', 'projects'])
      return {
        ...data,
        id: workspace
      }
    })
  )

  // Return
  return workspaces
}

/**
 * Update workspace
 * @param {Object} workspace Workspace { id }
 * @param {Object} data Data [{ key, value, ... }, ...]
 */
const update = async (workspace, data) => {
  await updatedB(workspace, data)
}

/**
 *
 * @param {Object} user User { id }
 * @param {Object} workspace Workspace { id }
 */
const del = async (user, workspace) => {
  await dBdel(workspace)

  // Delete workspace reference in user
  await updateUser(user, [
    {
      type: 'array',
      method: 'remove',
      key: 'workspaces',
      value: workspace.id
    }
  ])
}

export { add, get, getByUser, update, del }
