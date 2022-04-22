/** @module Database.System.Get */

import { tables } from '@/config/db'

import { query } from '..'

export type TSystemGet = ('allowsignup' | 'password' | 'defaultplugins')[]

export type TSystemGetAllowsignup = 'allowsignup'[]
export type TSystemGetPassword = 'password'[]
export type TSystemGetDefaultplugins = 'defaultplugins'[]

export interface ISystem<T = []> {
  allowsignup: TSystemGetAllowsignup extends T ? boolean : never
  password?: TSystemGetPassword extends T
    ? {
        min: number
        max: number
        requireLetter: boolean
        requireNumber: boolean
        requireSymbol: boolean
      }
    : never
  defaultplugins?: TSystemGetDefaultplugins extends T ? string[] : never[]
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
