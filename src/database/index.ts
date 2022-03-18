/** @module Database */

import { execSync } from 'child_process'
import { Pool } from 'pg'

import { IDataBaseEntry, IDataBaseResponse } from './index.d'

import {
  ADMIN,
  ADMIN_DATABASE,
  ADMIN_PASSWORD,
  USER,
  HOST,
  DATABASE,
  PASSWORD,
  PORT
} from '@/config/db'

export const checkdB = async (): Promise<boolean> => {
  // Legacy postgres
  try {
    const checkPool = new Pool({
      host: HOST,
      port: PORT,
      user: ADMIN,
      database: ADMIN_DATABASE,
      password: ADMIN_PASSWORD
    })
    await checkPool.query('SELECT NOW()')
    await checkPool.end()
    return true
  } catch (err) {}

  // Docker postgres
  try {
    // Existing tanatloc-postgres docker
    const id = execSync(
      'docker container ls -a --filter "name=tanatloc-postgres" -q'
    )

    if (!id.length) throw new Error()

    // Restart docker container
    execSync('docker restart ' + id.toString())

    // Get docker host
    const host = execSync(
      'docker inspect -f \'{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}\' $(docker ps --filter "name=tanatloc-postgres" --format "{{.ID}}")'
    )
    process.env.DB_HOST = host.toString().replace('\n', '')
    process.env.DB_ADMIN_PASSWORD ??
      (process.env.DB_ADMIN_PASSWORD = 'password')

    return true
  } catch (err) {}

  return false
}

let pool: Pool

/**
 * Start database
 * @returns Pool
 */
const startdB = (): void => {
  pool = new Pool({
    user: USER,
    host: process.env.DB_HOST || HOST,
    database: DATABASE,
    password: PASSWORD,
    port: PORT
  })
}

checkdB().then((res) => {
  if (!res) console.error('Database not found')
  else startdB()
})

/**
 * PostgreSQL query
 * @param command Command
 * @param args Arguments
 * @returns PostgreSQL query response
 */
export const query = async (
  command: string,
  args: Array<boolean | number | string | Array<string> | object>
): Promise<IDataBaseResponse> => {
  // Wait for pool
  while (!pool) await new Promise((resolve) => setTimeout(resolve, 10))

  // Query
  const client = await pool.connect()
  const res = await client.query(command, args)
  client.release()
  return res
}

/**
 * Get
 * @param db Database
 * @param id Id, or key
 * @param data Data
 * @param key Key override id
 * @returns PostgreSQL query response
 */
export const getter = async (
  db: string,
  id: string,
  data: Array<string>,
  key: string = 'id'
): Promise<IDataBaseResponse> => {
  return query(
    'SELECT ' + data.join(',') + ' FROM ' + db + ' WHERE ' + key + ' = $1',
    [id]
  )
}

/**
 * Update
 * @param db Database
 * @param id Id
 * @param data Data
 */
export const updater = async (
  db: string,
  id: string,
  data: Array<IDataBaseEntry>
): Promise<void> => {
  // Begin / end text
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
    switch (d.type) {
      case 'crypt':
        cryptUpdater(d, args, queryTextMiddle)
        break
      case 'date':
        dateUpdater(d, args, queryTextMiddle)
        break
      case 'array':
        arrayUpdater(d, args, queryTextMiddle)
        break
      case 'json':
        jsonUpdater(d, args, queryTextMiddle)
        break
      default:
        args.push(d.value)
        queryTextMiddle.push(d.key + ' = $' + args.length)
    }
  })
  await query(queryTextBegin + queryTextMiddle.join(', ') + queryTextEnd, args)
}

/**
 * Update (crypt)
 * @param data Data
 * @param args Args
 * @param queryText Query text
 */
const cryptUpdater = (
  data: IDataBaseEntry,
  args: Array<string>,
  queryText: Array<string>
): void => {
  args.push(data.value)
  queryText.push(data.key + ' = crypt($' + args.length + ", gen_salt('bf'))")
}

/**
 * Update (date)
 * @param data Data
 * @param args Args
 * @param queryText Query text
 */
const dateUpdater = (
  data: IDataBaseEntry,
  args: Array<string>,
  queryText: Array<string>
): void => {
  args.push(data.value)
  queryText.push(data.key + ' = to_timestamp($' + args.length + ')')
}

/**
 * Update (array)
 * @param data Data
 * @param args Args
 * @param queryText Query text
 */
const arrayUpdater = (
  data: IDataBaseEntry,
  args: Array<string>,
  queryText: Array<string>
): void => {
  switch (data.method) {
    case 'append':
      args.push(data.value)
      queryText.push(
        data.key + ' = array_append(' + data.key + ', $' + args.length + ')'
      )
      break
    case 'remove':
      args.push(data.value)
      queryText.push(
        data.key + ' = array_remove(' + data.key + ', $' + args.length + ')'
      )
      break
    default:
      throw new Error(
        'No method ' + (data.method || 'specified') + ' for array update'
      )
  }
}

/**
 * Update (json)
 * @param data Data
 * @param args Args
 * @param queryText Query text
 */
const jsonUpdater = (
  data: IDataBaseEntry,
  args: Array<string>,
  queryText: Array<string>
) => {
  switch (data.method) {
    case 'set':
      args.push(data.value)
      queryText.push(
        data.key +
          ' = jsonb_set(' +
          data.key +
          ", '{" +
          data.path.join(',') +
          "}', $" +
          args.length +
          ')'
      )
      break
    case 'erase':
      queryText.push(
        data.key +
          ' = jsonb_set(' +
          data.key +
          ", '{" +
          data.path.join(',') +
          "}', 'null'" +
          ')'
      )
      break
    default:
      throw new Error(
        'No method ' + (data.method || 'specified') + ' for json update'
      )
  }
}

/**
 * Delete
 * @param db Database
 * @param id Id
 */
export const deleter = async (db: string, id: string): Promise<void> => {
  await query('DELETE FROM ' + db + ' WHERE id = $1', [id])
}
