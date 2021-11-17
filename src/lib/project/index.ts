/** @namespace Lib.Project */

import path from 'path'
import { ReadStream } from 'fs'

import { STORAGE } from '@/config/storage'

import ProjectDB from '@/database/project'
import { IDataBaseEntry, IProject } from '@/database/index.d'

import { IProjectWithData } from '../index.d'
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
 * @param user User
 * @param workspace Workspace
 * @param project Project
 * @returns New project
 */
const add = async (
  user: { id: string },
  workspace: { id: string },
  project: { title: string; description?: string }
): Promise<IProject> => {
  const newProject = await ProjectDB.add(user, workspace, project)

  // Add project reference in workspace
  await Workspace.update(workspace, [
    { type: 'array', method: 'append', key: 'projects', value: newProject.id }
  ])

  return newProject
}

/**
 * Get
 * @memberof Lib.Project
 * @param id Project id
 * @param data Data
 * @returns Project
 */
const get = async (id: string, data: string[]): Promise<IProject> => {
  return ProjectDB.get(id, data)
}

/**
 * Get with data
 * @memberof Lib.Project
 * @param id Project id
 * @param data Data
 * @returns Project
 */
const getWithData = async (
  id: string,
  data: string[]
): Promise<IProjectWithData> => {
  const project = await get(id, data)

  // Check archived
  if (project?.archived) project.avatar = null

  const { avatar, owners, users, groups, ...projectData } = project
  const projectWithData: IProjectWithData = { ...projectData }

  // Get avatar
  if (project?.avatar) {
    try {
      const avatar = await Avatar.read(project.avatar)
      projectWithData.avatar = avatar
    } catch (err) {
      console.warn(err)
      projectWithData.avatar = undefined
    }
  }

  // Get owners
  if (project?.owners) {
    const owners = await Promise.all(
      project.owners.map(async (owner) => {
        const ownerData = await User.getWithData(owner, [
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
    projectWithData.owners = owners
  }

  // Get users
  if (project?.users) {
    const users = await Promise.all(
      project.users.map(async (user) => {
        const userData = await User.getWithData(user, [
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
    projectWithData.users = users
  }

  // Get groups
  if (project?.groups) {
    const groups = await Promise.all(
      project.groups.map(async (group) => {
        const groupData = await Group.getWithData(group, ['name'])
        return {
          id: group,
          ...groupData
        }
      })
    )
    projectWithData.groups = groups
  }

  return projectWithData
}

/**
 * Update
 * @memberof Lib.Project
 * @param Project Project
 * @param data Data
 */
const update = async (
  project: { id: string },
  data: IDataBaseEntry[]
): Promise<void> => {
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
      (g) => !groupsUpdate.value.includes(g)
    )

    await Promise.all(
      deleted.map(async (group) => {
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

    // Added groups
    const added = groupsUpdate.value.filter(
      (g) => !projectData.groups.find((gg) => gg === g)
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
 * @param workspace Workspace
 * @param project Project
 */
const del = async (
  workspace: { id: string },
  project: { id: string }
): Promise<void> => {
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
        await Simulation.del({ id: simulation })
      })
    )
  }

  // Delete project
  await ProjectDB.del(project)

  // Delete project reference in workspace
  await Workspace.update(workspace, [
    { type: 'array', method: 'remove', key: 'projects', value: project.id }
  ])
}

/**
 * Archive
 * @param project Project
 * @returns Read stream
 */
const archive = async (project: { id: string }): Promise<ReadStream> => {
  // Data
  const data = await get(project.id, [
    'title',
    'description',
    'avatar',
    'geometries',
    'simulations'
  ])

  // Create temporary path
  const temporaryPath = path.join(STORAGE, '.archive-' + project.id)
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
    C: STORAGE,
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

const Project = { add, get, getWithData, update, del, archive }
export default Project
