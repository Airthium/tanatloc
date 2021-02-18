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
 * @param {Object} data Data { type, method, key, path, value }
 */
const updater = async (db, id, data) => {
  if (data.type === 'crypt') {
    await query(
      'UPDATE ' +
        db +
        ' SET ' +
        data.key +
        " = crypt($2, gen_salt('bf')) WHERE id = $1",
      [id, data.value]
    )
  } else if (data.type === 'array') {
    if (data.method === 'append') {
      await query(
        'UPDATE ' +
          db +
          ' SET ' +
          data.key +
          ' = array_append(' +
          data.key +
          ', $2) WHERE id = $1',
        [id, data.value]
      )
    } else if (data.method === 'replace') {
      //TODO if necessary
      throw new Error('not coded')
    } else if (data.method === 'remove') {
      await query(
        'UPDATE ' +
          db +
          ' SET ' +
          data.key +
          ' = array_remove(' +
          data.key +
          ', $2) WHERE id = $1',
        [id, data.value]
      )
    } else if (data.method === 'switch') {
      //TODO if necessary
      throw new Error('not coded')
    } else {
      //TODO
      throw new Error('not coded')
    }
  } else if (data.type === 'json') {
    if (data.method === 'diff') {
      // Get existing json
      const res = await query(
        'SELECT ' + data.key + ' FROM ' + db + ' WHERE id = $1',
        [id]
      )
      const json = res.rows[0][data.key]

      // Set json
      const set = (object, path, value) => {
        const last = path.pop()
        const subObj = path.reduce((obj, key) => obj[key], object)
        subObj[last] = {
          ...subObj[last],
          ...value
        }
      }

      set(json, data.path, data.value)

      // Update
      await updater(db, id, { key: data.key, value: json })
    } else if (data.method === 'erase') {
      // Get existing json
      const res = await query(
        'SELECT ' + data.key + ' FROM ' + db + ' WHERE id = $1',
        [id]
      )
      const json = res.rows[0][data.key]

      // Set json
      const set = (object, path) => {
        const last = path.pop()
        const subObj = path.reduce((obj, key) => obj[key], object)
        subObj[last] = null
      }

      set(json, data.path)

      // Update
      await updater(db, id, { key: data.key, value: json })
    } else {
      // TODO
      throw new Error('not coded')
    }
  } else {
    await query('UPDATE ' + db + ' SET ' + data.key + ' = $2 WHERE id = $1', [
      id,
      data.value
    ])
  }
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
