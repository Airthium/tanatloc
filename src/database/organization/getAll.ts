/** @module Database.Organization.GetAll */

import { tables } from '@/config/db'

import { IOrganization, TOrganizationGet } from './get'

import { query } from '..'

/**
 * Get all
 * @param data Data
 * @returns Organizations
 */
export const getAll = async <T extends TOrganizationGet>(
  data: T
): Promise<IOrganization<T>[]> => {
  const response = await query(
    'SELECT ' + ['id', ...data].join(',') + ' FROM ' + tables.ORGANIZATIONS,
    []
  )

  return response.rows
}
