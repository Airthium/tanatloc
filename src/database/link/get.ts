/** @module Database.Link.Get */

import { tables } from '@/config/db'

import { getter } from '..'

export type TLinkGet = ('type' | 'email' | 'userid')[]

export interface ILink<T> {
  id: string
  type: T extends ['type'] ? string : never
  email: T extends ['email'] ? string : never
  userid?: T extends ['userid'] ? string : never
}

/**
 * Get
 * @param id Link id
 * @param data Data
 * @returns Link
 */
export const get = async <T extends TLinkGet>(
  id: string,
  data: T
): Promise<ILink<T>> => {
  const response = await getter(tables.LINKS, id, data)

  const link = response.rows[0]
  link && (link.id = id)

  return link
}
