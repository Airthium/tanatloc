/** @module Database.Avatar.Get */

import { tables } from '@/config/db'

import { getter } from '..'

export type TAvatarGet = ('name' | 'path' | 'type')[]

export type TAvatarGetName = 'name'[]
export type TAvatarGetPath = 'path'[]
export type TAvatarGetType = 'type'[]

export interface IAvatar<T = []> {
  id: string
  name: TAvatarGetName extends T ? string : never
  path: TAvatarGetPath extends T ? string : never
  type: TAvatarGetType extends T ? string : never
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
): Promise<IAvatar<T> | undefined> => {
  const response = await getter(tables.AVATARS, id, data)

  const avatar = response.rows[0]
  avatar && (avatar.id = id)

  return avatar
}

export { get }
