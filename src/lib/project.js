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
 *
 * @param {string} user User id
 * @param {Object} param1 { id, project: { title, description } } - id: Workspace id
 */
const add = async (user, { id, project: { title, description } }) => {
  const project = await dBadd(user, { title, description })

  // Add project reference in workspace
  await updateWorkspace({
    workspace: { id },
    data: [
      { type: 'array', method: 'append', key: 'projects', value: project.id }
    ]
  })

  return project
}

/**
 * Get project by id
 * @param {string} id Id
 */
const get = async (id) => {
  const project = await dBget(id, [
    'title',
    'descripion',
    'avatar',
    'owners',
    'users'
  ])

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
  await updateWorkspace({
    workspace: { id },
    data: [
      { type: 'array', method: 'remove', key: 'projects', value: project.id }
    ]
  })
}

export { add, get, update, del }
