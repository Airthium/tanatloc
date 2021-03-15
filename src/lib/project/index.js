/** @module lib/project */

import ProjectDB from '@/database/project'

import Avatar from '../avatar'
import User from '../user'
import Group from '../group'
import Workspace from '../workspace'
import Simulation from '../simulation'

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
  if (project?.avatar) {
    try {
      const avatar = await Avatar.read(project.avatar)
      project.avatar = avatar
    } catch (err) {
      console.warn(err)
      project.avatar = undefined
    }
  }

  // Get owners
  if (project?.owners) {
    const owners = await Promise.all(
      project.owners.map(async (owner) => {
        const ownerData = await User.get(owner, [
          'lastname',
          'firstname',
          'email',
          'avatar'
        ])
        return {
          id: owner,
          ...ownerData
        }
      })
    )
    project.owners = owners
  }

  // Get users
  if (project?.users) {
    const users = await Promise.all(
      project.users.map(async (user) => {
        const userData = await User.get(user, [
          'lastname',
          'firstname',
          'email',
          'avatar'
        ])
        return {
          id: user,
          ...userData
        }
      })
    )
    project.users = users
  }

  // Get groups
  if (project?.groups) {
    const groups = await Promise.all(
      project.groups.map(async (group) => {
        const groupData = await Group.get(group, ['name'])
        return {
          id: group,
          ...groupData
        }
      })
    )
    project.groups = groups
  }

  return project
}

/**
 * Update project
 * @param {Object} Project { id }
 * @param {Object} data Data [{ key, value, ...}, ...]
 */
const update = async (project, data) => {
  // Get data
  const projectData = await get(project.id, ['groups'])
  if (!projectData.groups) projectData.groups = []

  // Check groups
  const groupsUpdate = data.find((d) => d.key === 'groups' && !d.type)
  if (groupsUpdate) {
    // Delete groups
    const deleted = projectData.groups.filter(
      (g) => !groupsUpdate.value.includes(g.id)
    )

    await Promise.all(
      deleted.map(async (group) => {
        await Group.update({ id: group.id }, [
          {
            key: 'projects',
            type: 'array',
            method: 'remove',
            value: project.id
          }
        ])
      })
    )

    // Added groups
    const added = groupsUpdate.value.filter(
      (g) => !projectData.groups.find((gg) => gg.id === g)
    )
    await Promise.all(
      added.map(async (group) => {
        await Group.update({ id: group.id }, [
          {
            key: 'projects',
            type: 'array',
            method: 'append',
            value: project.id
          }
        ])
      })
    )
  }

  await ProjectDB.update(project, data)
}

/**
 * Delete project
 * @param {Object} workspace Workspace { id }
 * @param {Object} project Project { id }
 */
const del = async ({ id }, project) => {
  // Get data
  const data = await get(project.id, ['groups', 'simulations'])

  // Delete from groups
  if (data.groups) {
    await Promise.all(
      data.groups.map(async (group) => {
        await Group.update({ id: group }, [
          {
            key: 'projects',
            type: 'array',
            method: 'remove',
            value: project.id
          }
        ])
      })
    )
  }

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
