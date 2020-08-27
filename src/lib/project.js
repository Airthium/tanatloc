/** @module src/lib/project */

import {
  get as dBget,
  add as dBadd,
  update as dBupdate,
  del as dBdel
} from '../database/project'

import { readAvatar } from './avatar'
import { getUser } from './user'
import { update as updateWorkspace } from './workspace'

/**
 * Get project by id
 * @param {string} id Id
 */
const get = async (id) => {
  const project = await dBget(id)

  // Get avatar
  if (project.avatar) {
    const avatar = await readAvatar(project.avatar)
    project.avatar = avatar
  }

  // Get owners
  if (project.owners) {
    const owners = await Promise.all(
      project.owners.map(async (owner) => {
        return await getUser(owner)
      })
    )
    project.owners = owners
  }

  // Get users
  if (project.users) {
    const users = await Promise.all(
      project.users.map(async (user) => {
        return await getUser(user)
      })
    )
    project.users = users
  }

  return project
}

/**
 *
 * @param {string} user User id
 * @param {Object} param1 { id, project: { title, description } } - id: Workspace id
 */
const add = async (user, { id, project: { title, description } }) => {
  const project = await dBadd(user, { title, description })

  // Add project reference in workspace
  updateWorkspace({
    workspace: { id },
    data: [
      { type: 'array', method: 'append', key: 'projects', value: project.id }
    ]
  })

  return project
}

/**
 * Update project
 * @param {Object} param0 { project: { id }, data: [{ type, method, key, value }] }
 */
const update = async ({ project, data }) => {
  await dBupdate({ project, data })
}

/**
 *
 * @param {Object} param0 { id } - Workspace id
 * @param {Object} project Project { id }
 */
const del = async ({ id }, project) => {
  await dBdel(project)

  // Delete project reference in workspace
  updateWorkspace({
    workspace: { id },
    data: [
      { type: 'array', method: 'remove', key: 'projects', value: project.id }
    ]
  })
}

export { get, add, update, del }
