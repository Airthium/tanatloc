/** @module Lib.Link */

import { SUBSCRIBE, PASSWORD_RECOVERY, REVALIDATE } from '@/config/email'

import LinkDB, { ILink, INewLink, TLinkGet } from '@/database/link'

import UserLib from '../user'

/**
 * Add
 * @param link Link
 * @returns New link
 */
const add = async (link: {
  type: string
  email: string
  userid?: string
}): Promise<INewLink> => {
  return LinkDB.add(link)
}

/**
 * Get
 * @param id Id
 * @param data Data
 * @returns Link
 */
const get = async <T extends TLinkGet>(
  id: string,
  data: T
): Promise<ILink<T> | undefined> => {
  return LinkDB.get(id, data)
}

/**
 * Process
 * @param id Id
 * @param data Data
 */
const process = async (
  id: string,
  data?: { email: string; password: string }
): Promise<void> => {
  const link = await get(id, ['type', 'email', 'userid'])
  if (!link) return

  if (link.type === SUBSCRIBE || link.type === REVALIDATE) {
    // Update user
    await UserLib.update({ id: link.userid! }, [
      {
        key: 'isvalidated',
        value: 'true'
      }
    ])

    // Remove link
    await del({ id })
  } else if (link.type === PASSWORD_RECOVERY) {
    if (link.email !== data!.email) throw new Error('Inconsistent data')

    // Update user
    const user = await UserLib.getBy(data!.email, ['id'], 'email')
    user &&
      (await UserLib.update({ id: user.id }, [
        {
          type: 'crypt',
          key: 'password',
          value: data!.password
        }
      ]))

    // Remove link
    await del({ id })
  } else {
    // Remove link
    await del({ id })
    throw new Error('Unknown type')
  }
}

/**
 * Delete
 * @param link Link
 */
const del = async (link: { id: string }): Promise<void> => {
  await LinkDB.del(link)
}

const Link = { add, get, process, del }
export default Link
