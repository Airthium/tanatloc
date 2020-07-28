import { Pool } from 'pg'

const startdB = () => {
  const p = new Pool({
    user: 'tanatlocuser',
    host: 'localhost',
    database: 'tanatloc',
    password: 'tanatloc',
    port: 5432
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
