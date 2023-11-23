/** @module Lib.Project */

import path from 'path'
import { ReadStream } from 'fs'

import { IDataBaseEntry } from '@/database/index.d'
import {
  IGroupWithData,
  IProjectGet,
  IProjectWithData,
  IUserWithData
} from '../index.d'

import { LIMIT120, LIMIT50 } from '@/config/string'

import {
  AVATAR_RELATIVE,
  GEOMETRY,
  GEOMETRY_RELATIVE,
  SIMULATION_RELATIVE,
  STORAGE
} from '@/config/storage'

import ProjectDB, { INewProject, TProjectGet } from '@/database/project'

import Avatar from '../avatar'
import User from '../user'
import Group from '../group'
import Workspace from '../workspace'
import Geometry from '../geometry'
import Simulation from '../simulation'
import Tools from '../tools'

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
): Promise<INewProject> => {
  // Check title & description
  project.title = project.title.substring(0, LIMIT50).trim()
  project.description = project.description?.substring(0, LIMIT120).trim()

  // Add
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
const get = async <T extends TProjectGet>(
  id: string,
  data: T
): Promise<IProjectGet<T> | undefined> => {
  const projectData = await ProjectDB.get(id, data)
  if (!projectData) return

  if (data.includes('geometries') && !projectData.geometries)
    projectData.geometries = []

  if (data.includes('simulations') && !projectData.simulations)
    projectData.simulations = []

  if (data.includes('owners') && !projectData.owners) projectData.owners = []

  if (data.includes('users') && !projectData.users) projectData.users = []

  if (data.includes('groups') && !projectData.groups) projectData.groups = []

  return projectData as IProjectGet<T>
}

/**
 * Get avatar
 * @param project Project
 * @returns Avatar
 */
const getAvatar = async (project: {
  avatar: string
}): Promise<Buffer | undefined> => {
  try {
    return await Avatar.read(project.avatar)
  } catch (err) {
    console.warn(err)
  }
}

/**
 * Get users
 * @param users Users
 * @returns Users
 */
const getUsers = async (
  users: string[]
): Promise<
  IUserWithData<('lastname' | 'firstname' | 'email' | 'avatar')[]>[]
> => {
  const usersData = []
  for (const user of users) {
    const userData = await User.getWithData(user, [
      'lastname',
      'firstname',
      'email',
      'avatar'
    ])
    if (!userData) continue

    usersData.push(userData)
  }
  return usersData
}

/**
 * Get groups
 * @param groups Groups
 * @returns Groups
 */
const getGroups = async (
  groups: string[]
): Promise<IGroupWithData<'name'[]>[]> => {
  const groupsData = []
  for (const group of groups) {
    const groupData = await Group.getWithData(group, ['name'])
    if (!groupData) continue

    groupsData.push(groupData)
  }
  return groupsData
}

/**
 * Get with data
 * @param id Id
 * @param data Data
 * @returns Project
 */
const getWithData = async <T extends TProjectGet>(
  id: string,
  data: T
): Promise<IProjectWithData<T> | undefined> => {
  const project = await get(id, data)
  if (!project) return

  // Check archived
  if (project.archived) project.avatar = undefined

  const { avatar, owners, users, groups, ...projectData } = project

  // Get avatar
  let avatarData
  if (avatar) avatarData = await getAvatar({ avatar })

  // Get owners
  let ownersData
  if (owners) ownersData = await getUsers(owners)

  // Get users
  let usersData
  if (users) usersData = await getUsers(users)

  // Get groups
  let groupsData
  if (groups) groupsData = await getGroups(groups)

  return {
    ...projectData,
    avatar: avatarData,
    owners: ownersData,
    users: usersData,
    groups: groupsData
  } as IProjectWithData<T>
}

/**
 * Add to group
 * @param group Group
 * @param project Project
 */
const addToGroup = async (group: string, project: { id: string }) => {
  const groupData = await Group.get(group, ['projects'])
  if (!groupData) return

  if (!groupData.projects.includes(project.id))
    await Group.update({ id: group }, [
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
const deleteFromGroup = async (group: string, project: { id: string }) => {
  await Group.update({ id: group }, [
    {
      key: 'projects',
      type: 'array',
      method: 'remove',
      value: project.id
    }
  ])
}

/**
 * Add to user
 * @param user User
 * @param project Project
 */
const addToUser = async (user: string, project: { id: string }) => {
  const userData = await User.get(user, ['projects'])
  if (!userData) return

  if (!userData.projects.includes(project.id))
    await User.update({ id: user }, [
      {
        key: 'projects',
        type: 'array',
        method: 'append',
        value: project.id
      }
    ])
}

/**
 * Delete from user
 * @param user User
 * @param project Project
 */
const deleteFromUser = async (user: string, project: { id: string }) => {
  await User.update({ id: user }, [
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
  const groupsUpdate: { value: string[] } = data.find(
    (d) => d.key === 'groups' && !d.type
  )
  if (groupsUpdate) {
    // Get data
    const projectData = await get(project.id, ['groups'])

    if (projectData) {
      // Delete groups
      const deleted = projectData.groups.filter(
        (g) => !groupsUpdate.value.includes(g)
      )

      for (const group of deleted) await deleteFromGroup(group, project)

      // Added groups
      const added = groupsUpdate.value.filter(
        (g) => !projectData.groups.find((gg) => gg === g)
      )

      for (const group of added) await addToGroup(group, project)
    }
  }

  // Check users
  const usersUpdate: { value: string[] } = data.find(
    (d) => d.key === 'users' && !d.type
  )
  if (usersUpdate) {
    // Get data
    const projectData = await get(project.id, ['users'])

    if (projectData) {
      // Deleted users
      const deleted = projectData.users.filter(
        (u) => !usersUpdate.value.includes(u)
      )

      for (const user of deleted) await deleteFromUser(user, project)

      // Added users
      const added = usersUpdate.value.filter(
        (u) => !projectData.users.includes(u)
      )

      for (const user of added) await addToUser(user, project)
    }
  }

  // Check title
  const titleUpdate = data.find((d) => d.key === 'title')
  if (titleUpdate)
    titleUpdate.value = titleUpdate.value.substring(0, LIMIT50).trim()

  // Check description
  const descriptionUpdate = data.find((d) => d.key === 'description')
  if (descriptionUpdate)
    descriptionUpdate.value = descriptionUpdate.value
      .substring(0, LIMIT120)
      .trim()

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
  const data = await get(project.id, ['groups', 'users', 'simulations'])

  if (data) {
    // Delete from groups
    for (const group of data.groups) await deleteFromGroup(group, project)

    // Delete from users
    for (const user of data.users) await deleteFromUser(user, project)

    // Delete simulation
    for (const simulation of data.simulations)
      await Simulation.del({ id: simulation })
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
  if (!data) throw new Error('Project not found')

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
  for (const geometry of data.geometries) {
    try {
      await Geometry.archive(
        { id: geometry },
        path.join(temporaryPath, GEOMETRY_RELATIVE)
      )
    } catch (err) {}
  }

  // Archive simulations
  for (const simulation of data.simulations) {
    try {
      await Simulation.archive(
        { id: simulation },
        path.join(temporaryPath, SIMULATION_RELATIVE)
      )
    } catch (err) {}
  }

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

    for (const file of files) {
      await Tools.copyFile(
        { path: path.join(temporaryPath, AVATAR_RELATIVE), file: file.name },
        { path: path.join(STORAGE, AVATAR_RELATIVE), file: file.name }
      )
    }
  }

  // Geometry
  if (directories.includes(GEOMETRY_RELATIVE)) {
    const files = await Tools.listFiles(
      path.join(temporaryPath, GEOMETRY_RELATIVE)
    )

    for (const file of files) {
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
    }
  }

  // Simulation
  if (directories.includes(SIMULATION_RELATIVE)) {
    const simulationDirectories = await Tools.listDirectories(
      path.join(temporaryPath, SIMULATION_RELATIVE)
    )

    for (const simulation of simulationDirectories) {
      await Tools.copyDirectory(
        path.join(temporaryPath, SIMULATION_RELATIVE, simulation),
        path.join(STORAGE, SIMULATION_RELATIVE, simulation)
      )
    }
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
  } catch (err: any) {
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

/**
 * Copy
 * @param workspace Workspace
 * @param project Project
 */
const copy = async (
  user: { id: string },
  workspace: { id: string },
  project: { id: string }
): Promise<INewProject | undefined> => {
  const data = await get(project.id, [
    'title',
    'description',
    'geometries',
    'simulations',
    'owners',
    'users',
    'groups'
  ])
  if (!data) return

  const newProject = await add(user, workspace, {
    title: data.title + ' (Copy)',
    description: data.description
  })

  // Owners, users, groups
  await update({ id: newProject.id }, [
    {
      key: 'owners',
      value: data.owners
    },
    {
      key: 'users',
      value: data.users
    },
    {
      key: 'groups',
      value: data.groups
    }
  ])

  // Geometries
  const geometriesReplace: { old: string; new: string }[] = []
  for (const geometry of data.geometries) {
    // Data
    const geometryData = await Geometry.get(geometry, [
      'name',
      'extension',
      'uploadfilename'
    ])
    if (!geometryData) continue

    // Read geometry
    const buffer = await Tools.readFile(
      path.join(GEOMETRY, geometryData.uploadfilename)
    )

    // Update uploadfilename
    geometryData.uploadfilename =
      'copy_' + newProject.id + '_' + geometryData.uploadfilename

    // Add geometry
    const newGeometry = await Geometry.add(
      { id: newProject.id },
      {
        name: geometryData.name + '.' + geometryData.extension,
        uid: geometryData.uploadfilename,
        buffer: buffer
      }
    )

    // Update name
    await Geometry.update({ id: newGeometry.id }, [
      {
        key: 'name',
        value: geometryData.name
      }
    ])

    geometriesReplace.push({ old: geometry, new: newGeometry.id })
  }

  // Simulations
  for (const simulation of data.simulations) {
    const simulationData = await Simulation.get(simulation, ['name', 'scheme'])
    if (!simulationData) continue

    // Update geometries
    const geometry = simulationData.scheme.configuration.geometry
    const children = geometry.children
    children.forEach((child) => {
      const value = child.value
      if (value) {
        const replace = geometriesReplace.find((r) => r.old === value)
        child.value = replace?.new
      }
    })

    // Add simulation
    await Simulation.add(
      { id: newProject.id },
      { name: simulationData.name, scheme: simulationData.scheme }
    )
  }

  return newProject
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
  unarchiveFromFile,
  copy
}
export default Project
