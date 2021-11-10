/** @namespace Lib.Project */

import path from 'path'

import storage from '@/config/storage'

import ProjectDB from '@/database/project'

import Avatar from '../avatar'
import User from '../user'
import Group from '../group'
import Workspace from '../workspace'
import Geometry from '../geometry'
import Simulation from '../simulation'
import Tools from '../tools'

/**
 * Add
 * @memberof Lib.Project
 * @param {Object} user User `{ id }`
 * @param {Object} workspace Workspace: `{ id }`
 * @param {Object} project Project `{ title, description }`
 * @returns {Object} Project `{ id, title, description, owners, workspace }`
 */
const add = async (user, { id }, { title, description }) => {
  const project = await ProjectDB.add(user, { id }, { title, description })

  // Add project reference in workspace
  await Workspace.update({ id }, [
    { type: 'array', method: 'append', key: 'projects', value: project.id }
  ])

  return project
}

/**
 * Get
 * @memberof Lib.Project
 * @param {string} id Project's id
 * @param {Array} data Data
 * @param {boolean} [withData=true] With data
 * @returns {Object} Project `{ id, ...data }`
 */
const get = async (id, data, withData = true) => {
  const project = await ProjectDB.get(id, data)

  if (project?.archived) project.avatar = null

  // Get avatar
  if (withData && project?.avatar) {
    try {
      const avatar = await Avatar.read(project.avatar)
      project.avatar = avatar
    } catch (err) {
      console.warn(err)
      project.avatar = undefined
    }
  }

  // Get owners
  if (withData && project?.owners) {
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
  if (withData && project?.users) {
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
  if (withData && project?.groups) {
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
 * Update
 * @memberof Lib.Project
 * @param {Object} Project `{ id }`
 * @param {Object} data Data `[{ key, value, ...}, ...]`
 */
const update = async (project, data) => {
  // Modify last access
  data.push({
    type: 'date',
    key: 'lastaccess',
    value: Date.now() / 1000
  })

  // Check groups
  const groupsUpdate = data.find((d) => d.key === 'groups' && !d.type)
  if (groupsUpdate) {
    // Get data
    const projectData = await get(project.id, ['groups'])
    if (!projectData.groups) projectData.groups = []

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
 * Delete
 * @memberof Lib.Project
 * @param {Object} workspace Workspace `{ id }`
 * @param {Object} project Project `{ id }`
 */
const del = async ({ id }, project) => {
  // Get data
  const data = await get(project.id, ['groups', 'simulations'], false)

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
        await Simulation.del({ id: simulation })
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

/**
 * Archive
 * @param {Object} project Project { id }
 */
const archive = async (project) => {
  // Data
  const data = await get(
    project.id,
    ['title', 'description', 'avatar', 'geometries', 'simulations'],
    false
  )

  // Create temporary path
  const temporaryPath = path.join(storage.STORAGE, '.archive-' + project.id)
  await Tools.createPath(temporaryPath)

  // Create summary
  const content = 'Title: ' + data.title + '\nDescription: ' + data.description
  await Tools.writeFile(temporaryPath, 'summary.txt', content)

  // Get avatar
  if (data.avatar) await Avatar.archive({ id: data.avatar }, temporaryPath)

  // Archive geometries
  if (data.geometries)
    await Promise.all(
      data.geometries.map(async (geometry) =>
        Geometry.archive({ id: geometry }, temporaryPath)
      )
    )

  // Archive simulations
  if (data.simulations)
    await Promise.all(
      data.simulations.map(async (simulation) =>
        Simulation.archive({ id: simulation }, temporaryPath)
      )
    )

  // Create archive
  const archiveFileName = temporaryPath + '.tgz'
  Tools.archive(archiveFileName, {
    C: storage.STORAGE,
    path: '.archive-' + project.id
  })

  // Update project
  await update(project, [
    {
      key: 'archived',
      value: true
    }
  ])

  // Create read strem
  return Tools.readStream(archiveFileName)
}

const Project = { add, get, update, del, archive }
export default Project
