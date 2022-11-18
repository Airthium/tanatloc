/** @module Database */

import { execSync } from 'child_process'
import pg from 'pg'

import {
  IDataBaseEntry,
  IDataBaseEntryArray,
  IDataBaseEntryCrypt,
  IDataBaseEntryDate,
  IDataBaseEntryJSON,
  IDataBaseResponse
} from './index.d'

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

/**
 * Check database
 * @returns Valid
 */
export const checkdB = async (params?: {
  addStatus: (status: string) => Promise<void>
}): Promise<void> => {
  console.info('Check database...')
  await params?.addStatus('Checking database...')

  let error = 'Database not found'

  // Docker postgres
  try {
    // Existing tanatloc-postgres docker
    let id = execSync(
      'docker container ls -a --filter "name=tanatloc-postgres" -q'
    )

    if (!id.length) {
      id = execSync(
        'docker run --name=tanatloc-postgres -e POSTGRES_PASSWORD=password -p 5433:5432 -d postgres:15'
      )

      if (!id.length)
        throw new Error('Unable to create Tanatloc postgres docker')

      console.info(
        '- Tanatloc postgres docker created (' + id.toString().trim() + ')'
      )
    } else {
      console.info(
        '- Tanatloc postgres docker already exists (' +
          id.toString().trim() +
          ')'
      )
    }

    // Restart docker container
    execSync('docker start ' + id.toString())

    await new Promise((resolve) => setTimeout(resolve, 1_000))

    // Get docker host
    const host = execSync(
      'docker inspect -f "{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}" ' +
        id.toString().trim()
    )
    console.info('- docker host: ' + host.toString().trim())
    await params?.addStatus('Database found on ' + host.toString().trim())

    // Wait postgres start
    let ready: boolean = false
    let iter = 0
    console.info('- Starting database...')
    while (!ready && iter < 100) {
      try {
        iter++
        const checkPool = new pg.Pool({
          host: HOST,
          port: 5433,
          user: 'postgres',
          database: 'postgres',
          password: 'password'
        })
        await checkPool.query('SELECT NOW()')
        await checkPool.end()
        ready = true
        console.info('- Database ready')
        await params?.addStatus('Database ready')
      } catch (err) {
        console.warn('  Database not started')
        console.warn(err)
        console.warn('  Retry')
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
    }

    error = 'Unable to start database'
    if (!ready) throw new Error()

    process.env.DB_PORT = '5433'
    process.env.DB_ADMIN = 'postgres'
    process.env.DB_ADMIN_PASSWORD = 'password'
    process.env.DB_ADMIN_DATABASE = 'postgres'

    return
  } catch (err) {}

  // Legacy postgres
  try {
    const checkPool = new pg.Pool({
      host: HOST,
      port: PORT,
      user: ADMIN,
      database: ADMIN_DATABASE,
      password: ADMIN_PASSWORD
    })
    await checkPool.query('SELECT NOW()')
    await checkPool.end()

    return
  } catch (err) {}

  throw new Error(error)
}

/**
 * Start database
 * @returns Pool
 */
export const startdB = (): pg.Pool => {
  console.info('Start database...')
  return new pg.Pool({
    user: USER,
    host: HOST,
    database: DATABASE,
    password: PASSWORD,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : PORT
  })
}

/**
 * Stop database
 */
export const stopdB = async (): Promise<void> => {
  console.info('Stop database...')
  if (tanatloc?.pool) await tanatloc.pool.end()
}

/**
 * PostgreSQL query
 * @param command Command
 * @param args Arguments
 * @returns PostgreSQL query response
 */
export const query = async (
  command: string,
  args: (boolean | number | string | string[] | object | undefined)[]
): Promise<IDataBaseResponse> => {
  // Query
  const client = await tanatloc.pool.connect()
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
  id: string | undefined,
  data: Array<IDataBaseEntry>
): Promise<void> => {
  // Begin / end text
  const queryTextBegin = 'UPDATE ' + db + ' SET '
  const queryTextEnd = id ? ' WHERE id = $1' : ''
  const args = id ? [id] : []

  // Check that keys are uniques
  const keys: string[] = []
  data.forEach((d) => {
    if (keys.includes(d.key))
      throw new Error('Duplicate key in update query (key=' + d.key + ')')
    else keys.push(d.key)
  })

  // Set query text & args
  const queryTextMiddle: string[] = []
  data.forEach((d) => {
    switch (d.type) {
      case 'crypt':
        cryptUpdater(d as IDataBaseEntryCrypt, args, queryTextMiddle)
        break
      case 'date':
        dateUpdater(d as IDataBaseEntryDate, args, queryTextMiddle)
        break
      case 'array':
        arrayUpdater(d as IDataBaseEntryArray, args, queryTextMiddle)
        break
      case 'json':
        jsonUpdater(d as IDataBaseEntryJSON, args, queryTextMiddle)
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
  data: IDataBaseEntryCrypt,
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
  data: IDataBaseEntryDate,
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
  data: IDataBaseEntryArray,
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
    case 'set':
      args.push(String(data.index))
      args.push(data.value)
      queryText.push(
        data.key + '[$' + (args.length - 1) + '] = $' + args.length
      )
      break
    default:
      throw new Error(
        //@ts-ignore
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
  data: IDataBaseEntryJSON,
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
        //@ts-ignore
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
