import { databases } from '../config/db'
import query from '../src/database'

const createTables = async () => {
  console.info('Create dB tables')
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

    // Geometries
    console.info(' + Geometry table')
    await createGeometryTable()

    // Meshes
    console.info(' + Mesh table')
    await createMeshTable()

    // Simulations
    console.info(' + Simulation table')
    await createSimulationTable()

    // Results
    console.info(' + Result table')
    await createResultTable()

    // Tasks
    console.info(' + Task table')
    await createTaskTable()

    // Administrator
    await createAdmin()
  } catch (err) {
    console.error('dB tables creation failed!')
    console.error(err)
  }
}

const createAvatarTable = async () => {
  await query(
    `CREATE TABLE IF NOT EXISTS ` +
      databases.AVATARS +
      ` (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          path TEXT NOT NULL
        )`
  )
}

const createUsersTable = async () => {
  await query(
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
  )
}

const createWorkspaceTable = async () => {
  await query(
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
  )
}

const createProjectTable = async () => {
  await query(
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
          geometries uuid[],
          meshes uuid[],
          simulations uuid[],
          results uuid[],
          owners uuid[] NOT NULL,
          users uuid[],
          permissions jsonb,
          usersPermissions jsonb[],
          tasks uuid[]
        )`
  )
}

const createGeometryTable = async () => {
  await query(
    `CREATE TABLE IF NOT EXISTS ` +
      databases.GEOMETRIES +
      ` (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          file TEXT,
          dimension smallint,
          part TEXT
        )`
  )
}

const createMeshTable = async () => {
  await query(
    `CREATE TABLE IF NOT EXISTS ` +
      databases.MESHES +
      ` (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          origin jsonb,
          file TEXT,
          part TEXT,
          parameters jsonb
        )`
  )
}

const createSimulationTable = async () => {
  await query(
    `CREATE TABLE IF NOT EXISTS ` +
      databases.SIMULATIONS +
      ` (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          configuration jsonb,
          algorithm TEXT NOT NULL
        )`
  )
}

const createResultTable = async () => {
  await query(
    `CREATE TABLE IF NOT EXISTS ` +
      databases.RESULTS +
      ` (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          simulation uuid NOT NULL,
          task uuid NOT NULL,
          configuration jsonb,
          files TEXT[]
        )`
  )
}

const createTaskTable = async () => {
  await query(
    `CREATE TABLE IF NOT EXISTS ` +
      databases.TASKS +
      ` (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          target uuid,
          result uuid,
          date TIMESTAMP NOT NULL,
          type TEXT NOT NULL,
          status TEXT NOT NULL,
          system TEXT NOT NULL,
          token uuid,
          log TEXT NOT NULL,
          pid TEXT
        )`
  )
}

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

const createAdmin = async () => {
  const { rows } = await query('SELECT id FROM ' + databases.USERS)
  if (rows.length === 0) {
    console.info('*** Create Administrator ***')

    const password = passwordGenerator()

    await query(
      'INSERT INTO ' +
        databases.USERS +
        " (email, password, workspaces, isValidated, lastModificationDate, superuser) VALUES ($1, crypt($2, gen_salt('bf')), $3, $4, to_timestamp($5), $6)",
      ['admin', password, [], true, Date.now() / 1000, true]
    )
    console.info('Administrator account:')
    console.info('- username: admin')
    console.info('- password: ' + password)
  }
}

module.exports = createTables
