/** @module src/lib/project */

import ProjectDB from '@/database/project'

import Avatar from './avatar'
import User from './user'
import Workspace from './workspace'
import Simulation from './simulation'

/**
 * Add project
 * @param {Object} user User { id }
 * @param {Object} data Data { workspace: { id }, project: { title, description } }
 */
const add = async (
  user,
  { workspace: { id }, project: { title, description } }
) => {
  const project = await ProjectDB.add(user, { id }, { title, description })

  // Add project reference in workspace
  await Workspace.update({ id }, [
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
  const project = await ProjectDB.get(id, data)

  // Get avatar
  if (project && project.avatar) {
    try {
      const avatar = await Avatar.read(project.avatar)
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
        return User.get(owner, ['lastname', 'firstname', 'email', 'avatar'])
      })
    )
    project.owners = owners
  }

  // Get users
  if (project && project.users) {
    const users = await Promise.all(
      project.users.map(async (user) => {
        return User.get(user, ['lastname', 'firstname', 'email', 'avatar'])
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
  await ProjectDB.update(project, data)
}

/**
 * Delete project
 * @param {Object} workspace Workspace { id }
 * @param {Object} project Project { id }
 */
const del = async ({ id }, project) => {
  // Get data
  const data = await get(project.id, ['simulations'])

  // Delete simulation
  if (data.simulations) {
    await Promise.all(
      data.simulations.map(async (simulation) => {
        await Simulation.del(project, { id: simulation })
      })
    )
  }

  // Delete project
  await ProjectDB.del(project)

  // Delete project reference in workspace
  await Workspace.update({ id }, [
    { type: 'array', method: 'remove', key: 'projects', value: project.id }
  ])
}

export default { add, get, update, del }
