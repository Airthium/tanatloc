/** @module Database.Link.Del */

import { tables } from '@/config/db'

import { deleter } from '..'

/**
 * Delete
 * @param link Link
 */
export const del = async (link: { id: string }): Promise<void> => {
  await deleter(tables.LINKS, link.id)
}
