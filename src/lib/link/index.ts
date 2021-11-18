/** @namespace Lib.Link */

import { SUBSCRIBE, PASSWORD_RECOVERY, REVALIDATE } from '@/config/email'

import LinkDB from '@/database/link'
import { ILink, INewLink } from '@/database/index.d'

import UserLib from '../user'

/**
 * Add
 * @memberof Lib.Link
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
 * @memberof Lib.Link
 * @param id Id
 * @param data Data
 * @returns Link
 */
const get = async (id: string, data: Array<string>): Promise<ILink> => {
  return LinkDB.get(id, data)
}

/**
 * Process
 * @memberof Lib.Link
 * @param id Id
 * @param data Data
 */
const process = async (
  id: string,
  data?: { email: string; password: string }
): Promise<void> => {
  const link = await get(id, ['type', 'email', 'userid'])

  if (link.type === SUBSCRIBE || link.type === REVALIDATE) {
    // Update user
    await UserLib.update({ id: link.userid }, [
      {
        key: 'isvalidated',
        value: 'true'
      }
    ])

    // Remove link
    await del({ id })
  } else if (link.type === PASSWORD_RECOVERY) {
    if (link.email !== data.email) throw new Error('Inconsistent data')

    // Update user
    const user = await UserLib.getBy(data.email, ['id'], 'email')
    await UserLib.update({ id: user.id }, [
      {
        type: 'crypt',
        key: 'password',
        value: data.password
      }
    ])

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
 * @memberof Lib.Link
 * @param link Link
 */
const del = async (link: { id: string }): Promise<void> => {
  await LinkDB.del(link)
}

const Link = { add, get, process, del }
export default Link
