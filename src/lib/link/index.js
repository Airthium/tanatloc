import { SUBSCRIBE, PASSWORD_RECOVERY } from '@/config/email'

import LinkDB from '@/database/link'

import UserLib from '../user'

const add = async (link) => {
  return LinkDB.add(link)
}

const get = async (id, data) => {
  return LinkDB.get(id, data)
}

const process = async (id, data) => {
  const link = await get(id, ['type', 'email', 'userid'])

  if (link.type === SUBSCRIBE) {
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
  }
}

const del = async (link) => {
  await LinkDB.del(link)
}

const Link = { add, get, process, del }
export default Link
