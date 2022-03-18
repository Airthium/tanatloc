/** @module Install.CreateDatabase */

import { Pool, PoolClient } from 'pg'
import format from 'pg-format'

import { IDataBaseResponse } from '@/database/index.d'

import {
  ADMIN,
  ADMIN_DATABASE,
  ADMIN_PASSWORD,
  USER,
  HOST,
  PORT,
  DATABASE,
  PASSWORD,
  tables,
  schemas
} from '@/config/db'
import { query } from '@/database'

/**
 * Create database
 * @description Create the Tanatloc database with `pgcrypto` extension
 */
export const createDatabase = async (): Promise<void> => {
  console.info(' == Create dB == ')
  try {
    let pool: Pool
    let client: PoolClient

    // Pool
    pool = new Pool({
      host: process.env.DB_HOST || HOST,
      port: PORT,
      user: ADMIN,
      database: ADMIN_DATABASE,
      password: process.env.DB_ADMIN_PASSWORD || ADMIN_PASSWORD
    })
    client = await pool.connect()

    // Database
    console.info(' + Create database')
    const checkDatabase = await client.query(
      'SELECT FROM pg_database WHERE datname = $1',
      [DATABASE]
    )
    if (checkDatabase.rowCount === 0) {
      const createDatabaseQuery = format('CREATE DATABASE %s', DATABASE)
      await client.query(createDatabaseQuery)
    } else {
      console.info('   -- Database already exists')
    }

    // User
    console.info(' + Create user')
    const checkUser = await client.query(
      'SELECT FROM pg_user WHERE usename = $1',
      [USER]
    )
    if (checkUser.rowCount === 0) {
      const createUserQuery = format(
        "CREATE USER %s WITH ENCRYPTED PASSWORD '%s'",
        USER,
        PASSWORD
      )
      await client.query(createUserQuery)
    } else {
      console.info('   -- User already exists')
    }

    // Privileges
    const privilegesQuery = format(
      'GRANT ALL PRIVILEGES ON DATABASE %s TO %s',
      DATABASE,
      USER
    )
    await client.query(privilegesQuery)

    // Close
    client.release()
    pool.end()

    // New pool
    pool = new Pool({
      host: process.env.DB_HOST || HOST,
      port: PORT,
      database: DATABASE,
      user: USER,
      password: PASSWORD
    })
    client = await pool.connect()

    // Crypto
    console.info(' + Install pgcrypto extension')
    await client.query('CREATE EXTENSION IF NOT EXISTS pgcrypto')
    console.info('   -- Done')

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
 */
const createTables = async (): Promise<void> => {
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

    // Geometries
    console.info(' + Geometry table')
    await createGeometryTable()

    // Simulations
    console.info(' + Simulation table')
    await createSimulationTable()

    // Links
    console.info(' + Link table')
    await createLinkTable()

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
 * @param table Table
 * @returns Exists
 */
const checkTable = async (table: string): Promise<boolean> => {
  const res = await query(
    'SELECT EXISTS (SELECT FROM pg_tables WHERE tablename = $1)',
    [table]
  )

  const exists = res.rows[0].exists
  if (exists) {
    console.warn(' - Table ' + table + ' already exists')
  } else {
    console.warn(' - Create')
  }

  return exists
}

type Column = {
  column_name: string
  data_type: string
  is_nullable: string
}

type ColumnConfig = {
  name: string
  type: string
  constraint?: string
  default?: string
}

/**
 * Check schema
 * @param table Table
 */
const checkSchema = async (table: string): Promise<void> => {
  console.info('  -> Checking shema...')
  const schema = await query(
    'SELECT column_name, data_type, is_nullable, column_default from information_schema.columns where table_name = $1',
    [table]
  )
  const existingColumns = schema.rows

  for (const configColumn of schemas[table]) {
    try {
      const index = existingColumns.findIndex(
        (e) => e.column_name === configColumn.name
      )
      const column = existingColumns[index]

      if (!column) {
        await checkMissing(table, configColumn)
      } else {
        await checkType(table, column, configColumn)
        await checkConstraint(table, column, configColumn)
      }

      existingColumns.splice(index, 1)
    } catch (err) {
      console.warn('Unable to fix ' + table + '/' + configColumn.name)
      console.warn(err)
    }
  }

  if (existingColumns.length) {
    console.warn(' ⚠ Not used columns:')
    await Promise.all(
      existingColumns.map(async (column) => {
        console.warn(' - ' + column.column_name)

        await fixNotUsedColumn(table, column)
      })
    )
  }
}

/**
 * Check missing
 * @param table Table
 * @param configColumn Configuration column
 */
const checkMissing = async (
  table: string,
  configColumn: ColumnConfig
): Promise<void> => {
  console.error('   -- Missing column ' + table + '/' + configColumn.name)
  await fixMissingColumn(table, configColumn)
}

/**
 * Try to fix missing column
 * @param table Table
 * @param column Column
 */
const fixMissingColumn = async (
  table: string,
  column: ColumnConfig
): Promise<void> => {
  console.info('   -> Try to fix missing column')

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
        (column.default || ''),
      []
    )
    console.info('    OK')
  } catch (err) {
    console.warn('    ⚠ Fix failed')
    throw err
  }
}

/**
 * Check type
 * @param table Table
 * @param column Column
 * @param configColumn Configuration column
 */
const checkType = async (
  table: string,
  column: Column,
  configColumn: ColumnConfig
): Promise<void> => {
  if (
    (configColumn.type.includes('[]') && column.data_type === 'ARRAY') ||
    configColumn.type.toLowerCase() ===
      column.data_type.replace(' without time zone', '').toLowerCase()
  ) {
    console.info('   -- ' + configColumn.name + ' OK')
  } else {
    console.error('   ⚠ Wrong column type ' + table + '/' + configColumn.name)
    await fixColumnType(table, configColumn)
  }
}

/**
 * Try to fix column type
 * @param table Table
 * @param column Column
 */
const fixColumnType = async (
  table: string,
  column: ColumnConfig
): Promise<void> => {
  console.info('   -> Try to fix column type')

  try {
    await query(
      'ALTER TABLE ' +
        table +
        ' ALTER COLUMN ' +
        column.name +
        ' ' +
        column.type,
      []
    )
    console.info('    OK')
  } catch (err) {
    console.warn('    ⚠ Fix failed')
    throw err
  }
}

/**
 * Check constraint
 * @param table Table
 * @param column Column
 * @param configColumn Configuration column
 */
const checkConstraint = async (
  table: string,
  column: Column,
  configColumn: ColumnConfig
): Promise<void> => {
  if (
    (configColumn.constraint === 'NOT NULL' ||
      configColumn.constraint === 'PRIMARY KEY') &&
    column.is_nullable !== 'NO'
  ) {
    if (configColumn.constraint === 'NOT NULL')
      await fixColumnConstraint(table, configColumn)
    else {
      console.error(
        '   ⚠ Wrong column constraint ' + table + '/' + configColumn.name
      )
      throw new Error(
        'Wrong column constraint ' + table + '/' + configColumn.name
      )
    }
  }
}

/**
 * Try to fix column constraint
 * @param table Table
 * @param column Column
 */
const fixColumnConstraint = async (
  table: string,
  column: ColumnConfig
): Promise<void> => {
  console.info('   -> Try to fix column constraint')

  try {
    await query(
      'ALTER TABLE ' + table + ' ALTER COLUMN ' + column.name + ' SET NOT NULL',
      []
    )
    console.info('    OK')
  } catch (err) {
    console.warn('    ⚠ Fix failed')
    throw err
  }
}

/**
 * Try to fix not used column
 * @param table Table
 * @param column Column
 */
const fixNotUsedColumn = async (
  table: string,
  column: Column
): Promise<void> => {
  console.info(' -> Try to fix not used column')
  try {
    await query(
      'ALTER TABLE ' + table + ' DROP COLUMN ' + column.column_name,
      []
    )
    console.info('  OK')
  } catch (err) {
    console.warn('  ⚠ Fix failed')
    console.warn(err)
  }
}

/**
 * Create table
 * @param table Table
 * @param extra Extra function
 */
const createTable = async (
  table: string,
  extra?: () => Promise<IDataBaseResponse>
): Promise<void> => {
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
        ') ',
      []
    )
    extra && (await extra())
  }
}

/**
 * Create system table
 */
const createSystemTable = async (): Promise<void> => {
  await createTable(tables.SYSTEM, async () =>
    query('INSERT INTO ' + tables.SYSTEM + ' (allowsignup) VALUES (false)', [])
  )
}

/**
 * Create avatar table
 */
const createAvatarTable = async (): Promise<void> => {
  await createTable(tables.AVATARS)
}

/**
 * Create user table
 */
const createUsersTable = async (): Promise<void> => {
  await createTable(tables.USERS)
}

/**
 * Create organization table
 */
const createOrganizationTable = async (): Promise<void> => {
  await createTable(tables.ORGANIZATIONS)
}

/**
 * Create group table
 */
const createGroupsTable = async (): Promise<void> => {
  await createTable(tables.GROUPS)
}

/**
 * Create workspace table
 */
const createWorkspaceTable = async (): Promise<void> => {
  await createTable(tables.WORKSPACES)
}

/**
 * Create project table
 */
const createProjectTable = async (): Promise<void> => {
  await createTable(tables.PROJECTS)
}

/**
 * Create geometry table
 */
const createGeometryTable = async (): Promise<void> => {
  await createTable(tables.GEOMETRIES)
}

/**
 * Create simulation table
 */
const createSimulationTable = async (): Promise<void> => {
  await createTable(tables.SIMULATIONS)
}

/**
 * Create link table
 */
const createLinkTable = async (): Promise<void> => {
  await createTable(tables.LINKS)
}

/**
 * Create administrator
 */
const createAdmin = async (): Promise<void> => {
  const { rows } = await query('SELECT id FROM ' + tables.USERS, [])
  if (rows.length === 0) {
    console.info(' *** Create Administrator *** ')

    const password = 'password'

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
