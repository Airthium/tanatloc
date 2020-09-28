import { Pool } from 'pg'

import config, { databases } from '../config/db'
import query from '../src/database'

const createDatabase = async () => {
  console.info(' == Create dB == ')
  try {
    let pool, client

    // Pool
    pool = new Pool({
      host: config.HOST,
      port: config.PORT,
      user: 'postgres',
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

    // // Geometries
    // console.info(' + Geometry table')
    // await createGeometryTable()

    // // Meshes
    // console.info(' + Mesh table')
    // await createMeshTable()

    // Simulations
    console.info(' + Simulation table')
    await createSimulationTable()

    // // Results
    // console.info(' + Result table')
    // await createResultTable()

    // // Tasks
    // console.info(' + Task table')
    // await createTaskTable()

    // Administrator
    await createAdmin()

    console.log('')
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
          password TEXT,
          passwordLastChanged TIMESTAMP,
          email TEXT NOT NULL UNIQUE,
          avatar uuid REFERENCES ` +
        databases.AVATARS +
        `(id) ON DELETE SET NULL,
          workspaces uuid[],
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
          usersPermissions jsonb[],
          tasks uuid[]
        )`
    ))
}

// /**
//  * Create geometry table
//  */
// const createGeometryTable = async () => {
//   !(await checkTable(databases.GEOMETRIES)) &&
//     (await query(
//       `CREATE TABLE IF NOT EXISTS ` +
//         databases.GEOMETRIES +
//         ` (
//           id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
//           name TEXT NOT NULL,
//           file TEXT,
//           dimension smallint,
//           part TEXT
//         )`
//     ))
// }

// /**
//  * Create mesh table
//  * @memberof module:install
//  */
// const createMeshTable = async () => {
//   !(await checkTable(databases.MESHES)) &&
//     (await query(
//       `CREATE TABLE IF NOT EXISTS ` +
//         databases.MESHES +
//         ` (
//           id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
//           name TEXT NOT NULL,
//           origin jsonb,
//           file TEXT,
//           part TEXT,
//           parameters jsonb
//         )`
//     ))
// }

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
          scheme jsonb
        )`
    ))
}

// /**
//  * Create result table
//  * @memberof module:install
//  */
// const createResultTable = async () => {
//   !(await checkTable(databases.RESULTS)) &&
//     (await query(
//       `CREATE TABLE IF NOT EXISTS ` +
//         databases.RESULTS +
//         ` (
//           id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
//           name TEXT NOT NULL,
//           simulation uuid NOT NULL,
//           task uuid NOT NULL,
//           configuration jsonb,
//           files TEXT[]
//         )`
//     ))
// }

// /**
//  * Create task table
//  * @memberof module:install
//  */
// const createTaskTable = async () => {
//   !(await checkTable(databases.TASKS)) &&
//     (await query(
//       `CREATE TABLE IF NOT EXISTS ` +
//         databases.TASKS +
//         ` (
//           id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
//           name TEXT NOT NULL,
//           target uuid,
//           result uuid,
//           date TIMESTAMP NOT NULL,
//           type TEXT NOT NULL,
//           status TEXT NOT NULL,
//           system TEXT NOT NULL,
//           token uuid,
//           log TEXT NOT NULL,
//           pid TEXT
//         )`
//     ))
// }

/**
 * Password generator
 * @memberof module:install
 */
const passwordGenerator = () => {
  const length = 8
  const charset =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let password = ''
  for (let i = 0, n = charset.length; i < length; ++i) {
    password += charset.charAt(Math.floor(Math.random() * n))
  }
  return password
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
        " (email, password, workspaces, isValidated, lastModificationDate, superuser) VALUES ($1, crypt($2, gen_salt('bf')), $3, $4, to_timestamp($5), $6)",
      ['admin', password, [], true, Date.now() / 1000, true]
    )
    console.info(' Administrator account:')
    console.info(' - username: admin')
    console.info(' - password: ' + password)
  }
}

module.exports = createDatabase
