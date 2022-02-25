/** @module Database.Organization.GetAll */

import { IOrganization } from '../index.d'

import { tables } from '@/config/db'

import { query } from '..'

/**
 * Get all
 * @param data Data
 * @returns Organizations
 */
export const getAll = async (data: Array<string>): Promise<IOrganization[]> => {
  const response = await query(
    'SELECT ' + data.join(',') + ' FROM ' + tables.ORGANIZATIONS,
    []
  )

  return response.rows
}
