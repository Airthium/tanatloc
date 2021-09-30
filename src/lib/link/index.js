/** @namespace Lib.Link */

import { SUBSCRIBE, PASSWORD_RECOVERY, REVALIDATE } from '@/config/email'

import LinkDB from '@/database/link'

import UserLib from '../user'

/**
 * Add
 * @memberof Lib.Link
 * @param {Object} link Link { type, email, ?userid }
 * @returns {Object} Link { id, type, email, userid }
 */
const add = async (link) => {
  return LinkDB.add(link)
}

/**
 * Get
 * @memberof Lib.Link
 * @param {string} id Link id
 * @param {Array} data Data
 * @returns {Object} Link { id, ...data }
 */
const get = async (id, data) => {
  return LinkDB.get(id, data)
}

/**
 * Process
 * @memberof Lib.Link
 * @param {string} id Link id
 * @param {Object} data Data { email, password }
 */
const process = async (id, data) => {
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
 * @param {Object} link Link { id }
 */
const del = async (link) => {
  await LinkDB.del(link)
}

const Link = { add, get, process, del }
export default Link
