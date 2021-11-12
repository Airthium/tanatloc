/** @namespace Database */

import { Pool } from 'pg'

import { USER, HOST, DATABASE, PASSWORD, PORT } from '@/config/db'

export type DataBaseEntry = {
  key: string
  value: string
  type?: string
  method?: string
  path?: Array<string>
}

type DataBaseResponse = {
  rows: Array<any>
}

/**
 * Start database
 * @memberof Database
 * @returns {Object} Pool
 */
const startdB = (): Pool => {
  return new Pool({
    user: USER,
    host: HOST,
    database: DATABASE,
    password: PASSWORD,
    port: PORT
  })
}

const pool = startdB()

/**
 * PostgreSQL query
 * @memberof Database
 * @param {string} command Command
 * @param {Array} args Arguments
 * @returns {Object} PostgreSQL query response
 */
export const query = async (
  command: string,
  args: Array<boolean | number | string | Array<string> | object>
): Promise<DataBaseResponse> => {
  const client = await pool.connect()
  const res = await client.query(command, args)
  client.release()
  return res
}

/**
 * Get from dB
 * @memberof Database
 * @param {string} db Database
 * @param {string} id Id, or key
 * @param {Array} data Data
 * @param {string} key Key override id
 * @returns {Object} PostgreSQL query response
 */
export const getter = async (
  db: string,
  id: string,
  data: Array<string>,
  key: string = 'id'
): Promise<DataBaseResponse> => {
  return query(
    'SELECT ' + data.join(',') + ' FROM ' + db + ' WHERE ' + key + ' = $1',
    [id]
  )
}

/**
 * Update from dB
 * @memberof Database
 * @param {string} db Database
 * @param {string} id Id
 * @param {Array} data Data `[{ type, method, key, path, value }, ...]`
 */
export const updater = async (
  db: string,
  id: string,
  data: Array<DataBaseEntry>
): Promise<void> => {
  const queryTextBegin = 'UPDATE ' + db + ' SET '
  const queryTextEnd = id ? ' WHERE id = $1' : ''
  const args = id ? [id] : []

  // Check that keys are uniques
  const keys = []
  data.forEach((d) => {
    if (keys.includes(d.key))
      throw new Error('Duplicate key in update query (key=' + d.key + ')')
    else keys.push(d.key)
  })

  // Set query text & args
  const queryTextMiddle = []
  data.forEach((d) => {
    if (d.type === 'crypt') {
      args.push(d.value)
      queryTextMiddle.push(
        d.key + ' = crypt($' + args.length + ", gen_salt('bf'))"
      )
    } else if (d.type === 'date') {
      args.push(d.value)
      queryTextMiddle.push(d.key + ' = to_timestamp($' + args.length + ')')
    } else if (d.type === 'array') {
      if (d.method === 'append') {
        args.push(d.value)
        queryTextMiddle.push(
          d.key + ' = array_append(' + d.key + ', $' + args.length + ')'
        )
      } else if (d.method === 'remove') {
        args.push(d.value)
        queryTextMiddle.push(
          d.key + ' = array_remove(' + d.key + ', $' + args.length + ')'
        )
      } else {
        throw new Error('No method specified for array update')
      }
    } else if (d.type === 'json') {
      if (d.method === 'set') {
        if (!d.value) throw new Error('Empty json value')
        args.push(d.value)
        queryTextMiddle.push(
          d.key +
            ' = jsonb_set(' +
            d.key +
            ", '{" +
            d.path.join(',') +
            "}', $" +
            args.length +
            ')'
        )
      } else if (d.method === 'erase') {
        queryTextMiddle.push(
          d.key +
            ' = jsonb_set(' +
            d.key +
            ", '{" +
            d.path.join(',') +
            "}', 'null'" +
            ')'
        )
      } else {
        throw new Error('No method specified for json update')
      }
    } else {
      args.push(d.value)
      queryTextMiddle.push(d.key + ' = $' + args.length)
    }
  })
  await query(queryTextBegin + queryTextMiddle.join(', ') + queryTextEnd, args)
}

/**
 * Delete from dB
 * @memberof Database
 * @param {string} db Database
 * @param {string} id Id
 */
export const deleter = async (db: string, id: string): Promise<void> => {
  await query('DELETE FROM ' + db + ' WHERE id = $1', [id])
}

export default query
