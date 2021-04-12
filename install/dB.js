import { Pool } from 'pg'
import Crypto from 'crypto'

import config, { tables, schemas } from '../config/db'
import query from '@/database'

/**
 * Create database
 * @memberof module:install
 */
const createDatabase = async () => {
  console.info(' == Create dB == ')
  try {
    let pool, client

    // Pool
    pool = new Pool({
      host: config.HOST,
      port: config.PORT,
      user: config.ADMIN,
      database: config.ADMIN_DATABASE,
      password: config.ADMIN_PASSWORD
    })
    client = await pool.connect()

    // Database
    console.info(' + Create database')
    const checkDatabase = await client.query(
      "SELECT FROM pg_database WHERE datname = '" + config.DATABASE + "'"
    )
    if (checkDatabase.rowCount === 0)
      await client.query('CREATE DATABASE ' + config.DATABASE)

    // User
    console.info(' + Create user')
    const checkUser = await client.query(
      "SELECT FROM pg_user WHERE usename = '" + config.USER + "'"
    )
    if (checkUser.rowCount === 0)
      await client.query(
        'CREATE USER ' +
          config.USER +
          " WITH ENCRYPTED PASSWORD '" +
          config.PASSWORD +
          "'"
      )

    // Privileges
    await client.query(
      'GRANT ALL PRIVILEGES ON DATABASE ' +
        config.DATABASE +
        ' TO ' +
        config.USER
    )

    // Close
    client.release()
    pool.end()

    // New pool
    pool = new Pool({
      host: config.HOST,
      port: config.PORT,
      database: config.DATABASE,
      user: config.USER,
      password: config.PASSWORD
    })
    client = await pool.connect()

    // Crypto
    console.info(' + Install pgcrypto extension')
    await client.query('CREATE EXTENSION IF NOT EXISTS pgcrypto')

    // Close
    client.release()
    pool.end()

    await createTables()
  } catch (err) {
    console.error('dB creation failed!')
    console.error(err)
  }
}

/**
 * Create tables from config
 * @memberof module:install
 */
const createTables = async () => {
  console.info(' == Create dB tables == ')
  try {
    // System
    console.info(' + System table')
    await createSystemTable()

    // Avatars
    console.info(' + Avatar table')
    await createAvatarTable()

    // Users
    console.info(' + User table')
    await createUsersTable()

    // Organizations
    console.info(' + Organization table')
    await createOrganizationTable()

    // Groups
    console.info(' + Group table')
    await createGroupsTable()

    // Workspaces
    console.info(' + Workspace table')
    await createWorkspaceTable()

    // Projects
    console.info(' + Project table')
    await createProjectTable()

    // Simulations
    console.info(' + Simulation table')
    await createSimulationTable()

    // Administrator
    await createAdmin()

    console.info('')
  } catch (err) {
    console.error('dB tables creation failed!')
    console.error(err)
  }
}

/**
 * Check if table exists
 * @memberof module:install
 * @param {string} table Table
 */
const checkTable = async (table) => {
  const res = await query(
    'SELECT EXISTS (SELECT FROM pg_tables WHERE tablename = $1)',
    [table]
  )

  const exists = res.rows[0].exists
  if (exists) {
    console.warn(' - Table ' + table + ' already exists')
  }

  return exists
}

/**
 * Check schema
 * @param {string} table Table
 */
const checkSchema = async (table) => {
  console.info('  -> Checking shema...')
  const schema = await query(
    'SELECT column_name, data_type, is_nullable, column_default from information_schema.columns where table_name = $1',
    [table]
  )
  const existingColumns = schema.rows

  await Promise.all(
    schemas[table].map(async (column) => {
      let err = 0
      const index = existingColumns.findIndex(
        (e) => e.column_name === column.name
      )
      const byName = existingColumns[index]

      if (!byName) {
        console.error('   -- Missing column ' + table + '/' + column.name)
        err++

        console.info('   -> Try to fix')
        try {
          await query(
            'ALTER TABLE ' +
              table +
              ' ADD COLUMN ' +
              column.name +
              ' ' +
              column.type +
              ' ' +
              (column.constraint || '') +
              ' ' +
              (column.default || '')
          )
          console.info('    OK')
          err--
        } catch (fixError) {
          console.warn('    ⚠ Fix failed')
          console.warn(fixError)
        }
      } else {
        if (
          (column.type.includes('[]') && byName.data_type === 'ARRAY') ||
          column.type.toLowerCase() ===
            byName.data_type.replace(' without time zone', '').toLowerCase()
        ) {
          console.info('   -- ' + column.name + ' OK')
        } else {
          console.error('   ⚠ Wrong column type ' + table + '/' + column.name)
          err++

          console.info('   -> Try to fix')
          try {
            await query(
              'ALTER TABLE ' +
                table +
                ' ALTER COLUMN ' +
                column.name +
                ' ' +
                column.type
            )
            console.info('    OK')
            err--
          } catch (fixError) {
            console.warn('    ⚠ Fix failed')
            console.warn(fixError)
          }
        }
        if (
          (column.constraint === 'NOT NULL' ||
            column.constraint === 'PRIMARY KEY') &&
          byName.is_nullable !== 'NO'
        ) {
          console.error(
            '   ⚠ Wrong column constraint ' + table + '/' + column.name
          )
          err++

          if (column.constraint === 'NOT NULL') {
            console.info('   -> Try to fix')
            try {
              await query(
                'ALTER TABLE ' +
                  table +
                  ' ALTER COLUMN ' +
                  column.name +
                  ' SET NOT NULL'
              )
              console.info('    OK')
              err--
            } catch (fixError) {
              console.warn('    ⚠ Fix failed')
              console.warn(fixError)
            }
          }
        }

        if (err) {
          existingColumns[index].err = true
        }
      }

      if (!err) {
        existingColumns.splice(index, 1)
      }
    })
  )

  const remainingColumns = existingColumns.filter((e) => !e.err)
  if (remainingColumns.length) {
    console.warn(' ⚠ Not used columns:')
    await Promise.all(
      remainingColumns.map(async (column) => {
        console.warn(' - ' + column.column_name)

        console.info(' -> Try to fix')
        try {
          await query('ALTER TABLE ' + table + ' DROP COLUMN ' + column.name)
          console.info('  OK')
        } catch (fixError) {
          console.warn('  ⚠ Fix failed')
          console.warn(fixError)
        }
      })
    )
  }
}

/**
 * Create table
 * @memberof module:install
 * @param {string} table Table
 * @param {Function} extra Extra function
 */
const createTable = async (table, extra) => {
  if (await checkTable(table)) await checkSchema(table)
  else {
    await query(
      'CREATE TABLE ' +
        table +
        ' (' +
        schemas[table]
          .map(
            (schema) =>
              schema.name +
              ' ' +
              schema.type +
              ' ' +
              (schema.constraint || '') +
              ' ' +
              (schema.default || '')
          )
          .join(', ') +
        ') '
    )
    extra && (await extra())
  }
}

/**
 * Create system table
 * @memberof module: install
 */
const createSystemTable = async () => {
  await createTable(
    tables.SYSTEM,
    async () =>
      await query(
        'INSERT INTO ' + tables.SYSTEM + ' (allowsignup) VALUES (true)'
      )
  )
}

/**
 * Create avatar table
 * @memberof module:install
 */
const createAvatarTable = async () => {
  await createTable(tables.AVATARS)
}

/**
 * Create user table
 * @memberof module:install
 */
const createUsersTable = async () => {
  await createTable(tables.USERS)
}

/**
 * Create organization table
 * @memberof module: install
 */
const createOrganizationTable = async () => {
  await createTable(tables.ORGANIZATIONS)
}

/**
 * Create group table
 * @memberof module:install
 */
const createGroupsTable = async () => {
  await createTable(tables.GROUPS)
}

/**
 * Create workspace table
 * @memberof module:install
 */
const createWorkspaceTable = async () => {
  await createTable(tables.WORKSPACES)
}

/**
 * Create project table
 * @memberof module:install
 */
const createProjectTable = async () => {
  await createTable(tables.PROJECTS)
}

/**
 * Create simulation table
 * @memberof module:install
 */
const createSimulationTable = async () => {
  await createTable(tables.SIMULATIONS)
}

/**
 * Password generator
 * @memberof module:install
 */
const passwordGenerator = () => {
  const buffer = Crypto.randomBytes(256)
  return buffer.toString('hex')
}

/**
 * Create administrator
 * @memberof module:install
 */
const createAdmin = async () => {
  const { rows } = await query('SELECT id FROM ' + tables.USERS)
  if (rows.length === 0) {
    console.info(' *** Create Administrator *** ')

    const password = passwordGenerator()

    await query(
      'INSERT INTO ' +
        tables.USERS +
        " (email, password, workspaces, isValidated, lastModificationDate, superuser) VALUES ($1, crypt($2, gen_salt('bf')), $3, $4, to_timestamp($5), $6)",
      ['admin', password, [], true, Date.now() / 1000, true]
    )
    console.info(' Administrator account:')
    console.info(' - email: admin')
    console.info(' - password: ' + password)
  }
}

module.exports = createDatabase
