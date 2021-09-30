import { getter } from '..'
import { tables } from '@/config/db'

/**
 * Get
 * @memberof Database.Project
 * @param {string} id Id
 * @param {Array} data Data
 * @returns {Object} Project { id, ...data }
 */
const get = async (id, data) => {
  const response = await getter(tables.PROJECTS, id, data)

  const project = response.rows[0]
  project && (project.id = id)

  return project
}

export default get
