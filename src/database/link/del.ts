import { tables } from '@/config/db'

import { deleter } from '..'

/**
 * Delete
 * @memberof Database.Link
 * @param {Object} link Link `{ id }`
 */
export const del = async (link: { id: string }): Promise<void> => {
  await deleter(tables.LINKS, link.id)
}
