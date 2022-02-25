/** @module Database.Group.GetAll */

import { IGroup } from '../index.d'

import { tables } from '@/config/db'

import { query } from '..'

/**
 * Get all
 * @param data Data
 * @returns Groups
 */
export const getAll = async (data: Array<string>): Promise<Array<IGroup>> => {
  const response = await query(
    'SELECT ' + data.join(',') + ' FROM ' + tables.GROUPS,
    []
  )

  return response.rows
}
