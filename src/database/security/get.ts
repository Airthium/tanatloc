/** @module Database.Security.Get */

import { tables } from '@/config/db'

import { query } from '..'

export type TSecurityGet = 'encrypt_pass'[]

export type TSecurityGetEncryptPass = 'encrypt_pass'[]

export interface ISecurity<T = []> {
  encrypt_pass: TSecurityGetEncryptPass extends T ? string : never
}

export const get = async <T extends TSecurityGet>(
  data: T
): Promise<ISecurity<T>> => {
  const response = await query(
    'SELECT ' + data.join(',') + ' FROM ' + tables.SECURITY,
    []
  )

  return response.rows[0]
}
