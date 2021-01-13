import { Pool } from 'pg'
import Crypto from 'crypto'

import config, { databases } from '../config/db'
import query from '../src/database'

/**
 * Create database
 * @memberof module:install
 */
const createDatabase = async () => {
  console.info(' == Create dB == ')
  try {
    let pool, client

    // Set user (MacOS specific 😠)
    const user = process.platform === 'darwin' ? process.env.USER : 'postgres'

    // Pool
    pool = new Pool({
      host: config.HOST,
      port: config.PORT,
      user: user,
      database: 'postgres'
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
      user: 'postgres'
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
    // Avatars
    console.info(' + Avatar table')
    await createAvatarTable()

    // Users
    console.info(' + User table')
    await createUsersTable()

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
  if (exists)
    console.warn(
      ' ⚠ Table ' + table + ' already exists - Scheme is not verified for now'
    )

  return exists
}

/**
 * Create avatar table
 * @memberof module:install
 */
const createAvatarTable = async () => {
  !(await checkTable(databases.AVATARS)) &&
    (await query(
      `CREATE TABLE IF NOT EXISTS ` +
        databases.AVATARS +
        ` (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          path TEXT NOT NULL
        )`
    ))
}

/**
 * Create user table
 * @memberof module:install
 */
const createUsersTable = async () => {
  !(await checkTable(databases.USERS)) &&
    (await query(
      `CREATE TABLE IF NOT EXISTS ` +
        databases.USERS +
        ` (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          lastName TEXT,
          firstName TEXT,
          username TEXT NOT NULL UNIQUE,
          password TEXT,
          passwordLastChanged TIMESTAMP,
          email TEXT NOT NULL UNIQUE,
          avatar uuid REFERENCES ` +
        databases.AVATARS +
        `(id) ON DELETE SET NULL,
          workspaces uuid[],
          plugins jsonb[],
          isValidated BOOLEAN NOT NULL,
          lastModificationDate TIMESTAMP NOT NULL,
          superuser BOOLEAN NOT NULL
        )`
    ))
}

/**
 * Create workspace table
 * @memberof module:install
 */
const createWorkspaceTable = async () => {
  !(await checkTable(databases.WORKSPACES)) &&
    (await query(
      `CREATE TABLE IF NOT EXISTS ` +
        databases.WORKSPACES +
        ` (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          owners uuid[],
          users uuid[],
          invitedUsers uuid[],
          archivedProjects jsonb[],
          projects uuid[],
          permissions jsonb,
          usersPermissions jsonb[]
        )`
    ))
}

/**
 * Create project table
 * @memberof module:install
 */
const createProjectTable = async () => {
  !(await checkTable(databases.PROJECTS)) &&
    (await query(
      `CREATE TABLE IF NOT EXISTS ` +
        databases.PROJECTS +
        ` (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          avatar uuid REFERENCES ` +
        databases.AVATARS +
        `(id) ON DELETE SET NULL,
          public BOOLEAN NOT NULL,
          history jsonb,
          createdDate TIMESTAMP NOT NULL,
          lastAccess TIMESTAMP NOT NULL,
          simulations uuid[],
          owners uuid[] NOT NULL,
          users uuid[],
          permissions jsonb,
          usersPermissions jsonb[]
        )`
    ))
}

/**
 * Create simulation table
 * @memberof module:install
 */
const createSimulationTable = async () => {
  !(await checkTable(databases.SIMULATIONS)) &&
    (await query(
      `CREATE TABLE IF NOT EXISTS ` +
        databases.SIMULATIONS +
        ` (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          scheme jsonb,
          project uuid NOT NULL,
          tasks jsonb[]
        )`
    ))
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
  const { rows } = await query('SELECT id FROM ' + databases.USERS)
  if (rows.length === 0) {
    console.info(' *** Create Administrator *** ')

    const password = passwordGenerator()

    await query(
      'INSERT INTO ' +
        databases.USERS +
        " (email, username, password, workspaces, isValidated, lastModificationDate, superuser) VALUES ($1, $2, crypt($3, gen_salt('bf')), $4, $5, to_timestamp($6), $7)",
      ['admin', 'admin', password, [], true, Date.now() / 1000, true]
    )
    console.info(' Administrator account:')
    console.info(' - username: admin')
    console.info(' - password: ' + password)
  }
}

module.exports = createDatabase
