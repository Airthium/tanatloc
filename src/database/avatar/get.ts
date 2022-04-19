/** @module Database.Avatar.Get */

import { tables } from '@/config/db'

import { getter } from '..'

export type TAvatarGet = ('name' | 'path' | 'type')[]

export interface IAvatar<T> {
  id: string
  name: T extends ['name'] ? string : never
  path: T extends ['path'] ? string : never
  type: T extends ['type'] ? string : never
}

/**
 * Get
 * @param id Avatar id
 * @param data Data
 * @returns Avatar
 */
const get = async <T extends TAvatarGet>(
  id: string,
  data: T
): Promise<IAvatar<T>> => {
  const response = await getter(tables.AVATARS, id, data)

  const avatar = response.rows[0]
  avatar && (avatar.id = id)

  return avatar
}

export { get }
