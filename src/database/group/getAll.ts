/** @module Database.Group.GetAll */

import { tables } from '@/config/db'

import { TGroupGet, IGroup } from './get'

import { query } from '..'

/**
 * Get all
 * @param data Data
 * @returns Groups
 */
export const getAll = async <T extends TGroupGet>(
  data: T
): Promise<IGroup<T>[]> => {
  const response = await query(
    'SELECT ' + ['id', ...data].join(',') + ' FROM ' + tables.GROUPS,
    []
  )

  return response.rows
}
