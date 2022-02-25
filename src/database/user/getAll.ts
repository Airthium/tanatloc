/** @module Database.User.GetAll */

import { IUser } from '../index.d'

import { tables } from '@/config/db'

import { query } from '..'

/**
 * Get all
 * @param data Data
 * @returns Users
 */
export const getAll = async (data: Array<string>): Promise<Array<IUser>> => {
  const response = await query(
    'SELECT ' + data.join(',') + ' FROM ' + tables.USERS,
    []
  )

  return response.rows
}
