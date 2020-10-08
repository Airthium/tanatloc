/** @module src/lib/project */

import {
  add as dBadd,
  get as dBget,
  update as dBupdate,
  del as dBdel
} from '../database/project'

import { read as readAvatar } from './avatar'
import { get as getUser } from './user'
import { update as updateWorkspace } from './workspace'

/**
 * Add project
 * @param {Object} user User { id }
 * @param {Object} data Data { workspace: { id }, project: { title, description } }
 */
const add = async (
  user,
  { workspace: { id }, project: { title, description } }
) => {
  const project = await dBadd(user, { title, description })

  // Add project reference in workspace
  await updateWorkspace({ id }, [
    { type: 'array', method: 'append', key: 'projects', value: project.id }
  ])

  return project
}

/**
 * Get project
 * @param {string} id Project's id
 * @param {Array} data Data
 */
const get = async (id, data) => {
  const project = await dBget(id, data)

  // Get avatar
  if (project && project.avatar) {
    try {
      const avatar = await readAvatar(project.avatar)
      project.avatar = avatar
    } catch (err) {
      console.warn(err)
      project.avatar = undefined
    }
  }

  // Get owners
  if (project && project.owners) {
    const owners = await Promise.all(
      project.owners.map(async (owner) => {
        return await getUser(owner, [
          'lastname',
          'firstname',
          'email',
          'avatar'
        ])
      })
    )
    project.owners = owners
  }

  // Get users
  if (project.users) {
    const users = await Promise.all(
      project.users.map(async (user) => {
        return await getUser(user, ['lastname', 'firstname', 'email', 'avatar'])
      })
    )
    project.users = users
  }

  return project
}

/**
 * Update project
 * @param {Object} Project { id }
 * @param {Object} data Data [{ key, value, ...}, ...]
 */
const update = async (project, data) => {
  await dBupdate(project, data)
}

/**
 * Delete project
 * @param {Object} workspace Workspace { id }
 * @param {Object} project Project { id }
 */
const del = async ({ id }, project) => {
  await dBdel(project)

  // Delete project reference in workspace
  await updateWorkspace({ id }, [
    { type: 'array', method: 'remove', key: 'projects', value: project.id }
  ])
}

export { add, get, update, del }
