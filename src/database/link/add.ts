/** @module Database.Link.Add */

import { tables } from '@/config/db'

import { query } from '..'

export interface INewLink {
  id: string
  type: string
  email: string
  userid?: string
}

/**
 * Add
 * @param link Link
 * @returns New link
 */
export const add = async (link: {
  type: string
  email: string
  userid?: string
}): Promise<INewLink> => {
  const response = await query(
    'INSERT INTO ' +
      tables.LINKS +
      ' (type, email, userid) VALUES ($1, $2, $3) RETURNING id',
    [link.type, link.email, link.userid]
  )

  const newLink = response.rows[0]
  newLink && (newLink.type = link.type)
  newLink && (newLink.email = link.email)
  newLink && (newLink.userid = link.userid)

  return newLink
}
