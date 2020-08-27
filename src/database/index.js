/** @module src/database */

import { Pool } from 'pg'

import config from '../../config/db'

/**
 * Start database
 * @returns {Object} Pool
 */
const startdB = () => {
  const p = new Pool({
    user: config.USER,
    host: config.HOST,
    database: config.DATABASE,
    password: config.PASSWORD,
    port: config.PORT
  })

  p.connect().catch((err) => {
    console.error(err)
    p.end()
  })

  return p
}

const pool = startdB()

/**
 * PostgreSQL query
 * @param {string} command Command
 * @param {Array} args Arguments
 */
const query = async (command, args) => {
  const res = await pool.query(command, args)
  return res
}

const getter = async (db, id, data) => {
  return await query(
    'SELECT ' + data.join(',') + ' FROM ' + db + ' WHERE id = $1',
    [id]
  )
}

const updater = async (db, id, data) => {
  if (data.type === 'array') {
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
      //TODO
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
      //TODO
    } else {
      //TODO
    }
  } else {
    await query('UPDATE ' + db + ' SET ' + data.key + ' = $2 WHERE id = $1', [
      id,
      data.value
    ])
  }
}

const deleter = async (db, id) => {
  await query('DELETE FROM ' + db + ' WHERE id = $1', [id])
}

export default query
export { getter, updater, deleter }
