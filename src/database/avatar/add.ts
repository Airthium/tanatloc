import query from '..'
import { tables } from '@/config/db'

type Avatar = {
  id: string
  name: string
}

/**
 * Add
 * @memberof Database.Avatar
 * @param {Object} data Data `{ name, path }`
 * @returns {Object} Avatar `{ id, name }`
 */
export const add = async (avatar: {
  name: string
  path: string
}): Promise<Avatar> => {
  const response = await query(
    'INSERT INTO ' +
      tables.AVATARS +
      ' (name, path) VALUES ($1, $2) RETURNING id',
    [avatar.name, avatar.path]
  )

  return {
    ...response.rows[0],
    name: avatar.name
  }
}
