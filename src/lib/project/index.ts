/** @module Lib.Project */

import path from 'path'
import { ReadStream } from 'fs'

import { IDataBaseEntry, IProject } from '@/database/index.d'
import { IGroupWithData, IProjectWithData, IUserWithData } from '../index.d'

import {
  AVATAR_RELATIVE,
  GEOMETRY_RELATIVE,
  SIMULATION_RELATIVE,
  STORAGE
} from '@/config/storage'

import ProjectDB from '@/database/project'

import Avatar from '../avatar'
import User from '../user'
import Group from '../group'
import Workspace from '../workspace'
import Geometry from '../geometry'
import Simulation from '../simulation'
import Tools from '../tools'

import tar from 'tar'

/**
 * Add
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
 * @param id Id
 * @param data Data
 * @returns Project
 */
const get = async (id: string, data: string[]): Promise<IProject> => {
  const projectData = await ProjectDB.get(id, data)

  if (data.includes('geometries') && !projectData.geometries)
    projectData.geometries = []

  if (data.includes('simulations') && !projectData.simulations)
    projectData.simulations = []

  if (data.includes('owners') && !projectData.owners) projectData.owners = []

  if (data.includes('users') && !projectData.users) projectData.users = []

  if (data.includes('groups') && !projectData.groups) projectData.groups = []

  return projectData
}

/**
 * Get avatar
 * @param project Project
 * @returns Avatar
 */
const getAvatar = async (project: IProject): Promise<Buffer> => {
  try {
    return await Avatar.read(project.avatar)
  } catch (err) {
    console.warn(err)
  }
}

/**
 * Get owners
 * @param project Project
 * @returns Owners
 */
const getOwners = async (project: IProject): Promise<IUserWithData[]> => {
  return Promise.all(
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
}

/**
 * Get users
 * @param project Project
 * @returns Users
 */
const getUsers = async (project: IProject): Promise<IUserWithData[]> => {
  return Promise.all(
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
}

/**
 * Get groups
 * @param project Project
 * @returns Groups
 */
const getGroups = async (project: IProject): Promise<IGroupWithData[]> => {
  return Promise.all(
    project.groups.map(async (group) => {
      const groupData = await Group.getWithData(group, ['name'])
      return {
        id: group,
        ...groupData
      }
    })
  )
}

/**
 * Get with data
 * @param id Id
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

  const { avatar, owners, users, groups, ...projectData } = { ...project }
  const projectWithData: IProjectWithData = { ...projectData }

  // Get avatar
  if (avatar) projectWithData.avatar = await getAvatar(project)

  // Get owners
  if (owners) projectWithData.owners = await getOwners(project)

  // Get users
  if (users) projectWithData.users = await getUsers(project)

  // Get groups
  if (groups) projectWithData.groups = await getGroups(project)

  return projectWithData
}

/**
 * Add to group
 * @param group Group
 * @param project Project
 */
const addToGroup = async (group: { id: string }, project: { id: string }) => {
  const groupData = await Group.get(group.id, ['projects'])
  if (!groupData.projects.includes(project.id))
    await Group.update({ id: group.id }, [
      {
        key: 'projects',
        type: 'array',
        method: 'append',
        value: project.id
      }
    ])
}

/**
 * Delete from group
 * @param group Group
 * @param project Project
 */
const deleteFromGroup = async (
  group: { id: string },
  project: { id: string }
) => {
  await Group.update({ id: group.id }, [
    {
      key: 'projects',
      type: 'array',
      method: 'remove',
      value: project.id
    }
  ])
}

/**
 * Update
 * @param project Project
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

    // Delete groups
    const deleted = projectData.groups.filter(
      (g) => !groupsUpdate.value.includes(g)
    )

    await Promise.all(
      deleted.map(async (group) => {
        await deleteFromGroup({ id: group }, project)
      })
    )

    // Added groups
    const added = groupsUpdate.value.filter(
      (g) => !projectData.groups.find((gg) => gg === g)
    )
    await Promise.all(
      added.map(async (group) => {
        await addToGroup({ id: group }, project)
      })
    )
  }

  await ProjectDB.update(project, data)
}

/**
 * Delete
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
        await deleteFromGroup({ id: group }, project)
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
  if (data.avatar)
    try {
      await Avatar.archive(
        { id: data.avatar },
        path.join(temporaryPath, AVATAR_RELATIVE)
      )
    } catch (err) {}

  // Archive geometries
  if (data.geometries)
    await Promise.all(
      data.geometries.map(async (geometry) => {
        try {
          await Geometry.archive(
            { id: geometry },
            path.join(temporaryPath, GEOMETRY_RELATIVE)
          )
        } catch (err) {}
      })
    )

  // Archive simulations
  if (data.simulations)
    await Promise.all(
      data.simulations.map(async (simulation) => {
        try {
          await Simulation.archive(
            { id: simulation },
            path.join(temporaryPath, SIMULATION_RELATIVE)
          )
        } catch (err) {}
      })
    )

  // Create archive
  const archiveFileName = temporaryPath + '.tgz'
  await Tools.archive(archiveFileName, {
    C: STORAGE,
    path: '.archive-' + project.id
  })

  // Remove temporary path
  await Tools.removeDirectory(temporaryPath)

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

/**
 * Unarchive from server
 * @param project Project
 */
const unarchiveFromServer = async (project: { id: string }): Promise<void> => {
  // Temporary path
  const temporaryPath = path.join(STORAGE, '.archive-' + project.id)

  // Archive file name
  const archiveFileName = temporaryPath + '.tgz'

  // Check if the archive tgz exists
  let directories = []
  try {
    await Tools.unarchive(archiveFileName, {
      C: STORAGE,
      path: '.archive-' + project.id
    })

    directories = await Tools.listDirectories(temporaryPath)
  } catch (err) {
    throw new Error('Archive not found')
  }

  // Avatar
  if (directories.includes(AVATAR_RELATIVE)) {
    const files = await Tools.listFiles(
      path.join(temporaryPath, AVATAR_RELATIVE)
    )

    await Promise.all(
      files.map(async (file) => {
        await Tools.copyFile(
          { path: path.join(temporaryPath, AVATAR_RELATIVE), file: file.name },
          { path: path.join(STORAGE, AVATAR_RELATIVE), file: file.name }
        )
      })
    )
  }

  // Geometry
  if (directories.includes(GEOMETRY_RELATIVE)) {
    const files = await Tools.listFiles(
      path.join(temporaryPath, GEOMETRY_RELATIVE)
    )

    await Promise.all(
      files.map(async (file) => {
        if (file.isDirectory())
          await Tools.copyDirectory(
            path.join(temporaryPath, GEOMETRY_RELATIVE, file.name),
            path.join(STORAGE, GEOMETRY_RELATIVE, file.name)
          )
        else if (file.isFile())
          await Tools.copyFile(
            {
              path: path.join(temporaryPath, GEOMETRY_RELATIVE),
              file: file.name
            },
            { path: path.join(STORAGE, GEOMETRY_RELATIVE), file: file.name }
          )
      })
    )
  }

  // Simulation
  if (directories.includes(SIMULATION_RELATIVE)) {
    const simulationDirectories = await Tools.listDirectories(
      path.join(temporaryPath, SIMULATION_RELATIVE)
    )

    await Promise.all(
      simulationDirectories.map(async (simulation) => {
        await Tools.copyDirectory(
          path.join(temporaryPath, SIMULATION_RELATIVE, simulation),
          path.join(STORAGE, SIMULATION_RELATIVE, simulation)
        )
      })
    )
  }

  // Update project
  await update(project, [
    {
      key: 'archived',
      value: false
    }
  ])

  // Remove temporyPath
  await Tools.removeDirectory(temporaryPath)

  // Remove archive
  await deleteArchiveFile(project)
}

/**
 * Delete archive file
 * @param project Project
 */
const deleteArchiveFile = async (project: { id: string }): Promise<void> => {
  // Temporary path
  const temporaryPath = path.join(STORAGE, '.archive-' + project.id)

  // Archive file name
  const archiveFileName = temporaryPath + '.tgz'

  // Remove archive
  try {
    await Tools.removeFile(archiveFileName)
  } catch (err) {
    if (err.code !== 'ENOENT') throw err
  }
}

/**
 * Unarchive from file
 * @param project Project
 * @param buffer Buffer
 */
const unarchiveFromFile = async (project: { id: string }, buffer: Buffer) => {
  // Write archive
  await Tools.writeFile(
    STORAGE,
    '.archive-' + project.id + '.tgz',
    Buffer.from(buffer)
  )

  // Unarchive
  await unarchiveFromServer(project)
}

const Project = {
  add,
  get,
  getWithData,
  update,
  del,
  archive,
  unarchiveFromServer,
  deleteArchiveFile,
  unarchiveFromFile
}
export default Project
