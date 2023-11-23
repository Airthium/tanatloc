/** @module Database.Link.Get */

import { tables } from '@/config/db'

import { getter } from '..'

export type TLinkGet = ('type' | 'email' | 'userid')[]

export type TLinkGetType = 'type'[]
export type TLinkGetEmail = 'email'[]
export type TLinkGetUserid = 'userid'[]

export interface ILink<T = []> {
  id: string
  type: TLinkGetType extends T ? string : never
  email: TLinkGetEmail extends T ? string : never
  userid?: TLinkGetUserid extends T ? string : never
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
): Promise<ILink<T> | undefined> => {
  const response = await getter(tables.LINKS, id, data)

  const link = response.rows[0]
  link && (link.id = id)

  return link
}
