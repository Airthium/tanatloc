import { tables } from '@/config/db'

import { getter } from '..'

type Link = {
  id: string
  type?: string
  email?: string
  userid?: string
}

/**
 * Get
 * @memberof Database.Link
 * @param {string} id Link's id
 * @param {Array} data Data
 * @returns {Object} Link `{ id, ...data }`
 */
export const get = async (id: string, data: Array<string>): Promise<Link> => {
  const response = await getter(tables.LINKS, id, data)

  const link = response.rows[0]
  link && (link.id = id)

  return link
}
