/** @module Database.System.Get */

import { tables } from '@/config/db'

import { query } from '..'

export type TSystemGet = ('allowsignup' | 'password' | 'defaultplugins')[]

export interface ISystem<T> {
  allowsignup: T extends ['allowsignup'] ? boolean : never
  password?: T extends ['password']
    ? {
        min: number
        max: number
        requireLetter: boolean
        requireNumber: boolean
        requireSymbol: boolean
      }
    : never
  defaultplugins?: T extends ['defaultplugins'] ? string[] : never[]
}

/**
 * Get items
 * @param data Data
 * @returns System
 */
export const get = async <T extends TSystemGet>(
  data: T
): Promise<ISystem<T>> => {
  const response = await query(
    'SELECT ' + data.join(',') + ' FROM ' + tables.SYSTEM,
    []
  )

  return response.rows[0]
}
