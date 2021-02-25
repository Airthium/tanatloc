/** @module src/database */

import { Pool } from 'pg'

import config from '@/config/db'

/**
 * Start database
 * @returns {Object} Pool
 */
const startdB = () => {
  return new Pool({
    user: config.USER,
    host: config.HOST,
    database: config.DATABASE,
    password: config.PASSWORD,
    port: config.PORT
  })
}

const pool = startdB()

/**
 * PostgreSQL query
 * @param {string} command Command
 * @param {Array} args Arguments
 */
const query = async (command, args) => {
  const client = await pool.connect()
  const res = await client.query(command, args)
  client.release()
  return res
}

/**
 * Get from dB
 * @param {string} db Database
 * @param {string} id Id, or key
 * @param {Array} data Data
 * @param {string} key Key override id
 */
const getter = async (db, id, data, key = 'id') => {
  return query(
    'SELECT ' + data.join(',') + ' FROM ' + db + ' WHERE ' + key + ' = $1',
    [id]
  )
}

/**
 * Update from dB
 * @param {string} db Database
 * @param {string} id Id
 * @param {Array} data Data [{ type, method, key, path, value }, ...]
 */
const updater = async (db, id, data) => {
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
  console.log(queryTextBegin + queryTextMiddle.join(', ') + queryTextEnd)
  console.log(args)
  await query(queryTextBegin + queryTextMiddle.join(', ') + queryTextEnd, args)
}

/**
 * Delete from dB
 * @param {string} db Database
 * @param {string} id Id
 */
const deleter = async (db, id) => {
  await query('DELETE FROM ' + db + ' WHERE id = $1', [id])
}

export default query
export { getter, updater, deleter }
