import { Pool } from 'pg'

import config from '../../config/db'

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

export default async (query, args) => {
  const res = await pool.query(query, args)
  return res
}
