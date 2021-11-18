import { tables } from '@/config/db'

import { getter } from '..'
import { ILink } from '../index.d'

/**
 * Get
 * @memberof Database.Link
 * @param id Link id
 * @param data Data
 * @returns Link
 */
export const get = async (id: string, data: Array<string>): Promise<ILink> => {
  const response = await getter(tables.LINKS, id, data)

  const link = response.rows[0]
  link && (link.id = id)

  return link
}
