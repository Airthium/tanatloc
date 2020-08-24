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

export default query
