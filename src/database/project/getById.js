import query from '..'
import { databases } from '../../../config/db'

import { readAvatar } from '../../lib/avatar'
import { getUser } from '../../lib/user'

/**
 * Get project by id
 * @memberof module:src/database/project
 * @param {string} id Id
 */
const getById = async (id) => {
  const response = await query(
    'SELECT title, description, avatar, owners, users FROM ' +
      databases.PROJECTS +
      ' WHERE id = $1',
    [id]
  )
  const project = response.rows[0]

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

  project.id = id
  return project
}

export default getById
