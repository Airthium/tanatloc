/** @module config/db */

/**
 * Database configuration
 */
module.exports = {
  ADMIN:
    process.env.DB_ADMIN ||
    (process.platform === 'darwin' ? process.env.USER : 'postgres'),
  ADMIN_DATABASE: process.env.DB_ADMIN_DATABASE || 'postgres',
  ADMIN_PASSWORD: process.env.DB_ADMIN_PASSWORD || '',
  USER: process.env.DB_USER || 'tanatlocuser',
  HOST: process.env.DB_HOST || 'localhost',
  PORT: process.env.DB_PORT || 5432,
  DATABASE: process.env.DB_DATABASE || 'tanatloc2',
  PASSWORD: process.env.DB_PASSWORD || 'tanatloc'
}

/**
 * Tables names
 */
module.exports.databases = {
  SYSTEM: 'tanatloc_system',
  USERS: 'tanatloc_users',
  ORGANIZATIONS: 'tanatloc_organizations',
  GROUPS: 'tanatloc_groups',
  WORKSPACES: 'tanatloc_workspaces',
  PROJECTS: 'tanatloc_projects',
  GEOMETRIES: 'tanatloc_geometries',
  MESHES: 'tanatloc_meshes',
  SIMULATIONS: 'tanatloc_simulations',
  RESULTS: 'tanatloc_results',
  AVATARS: 'tanatloc_avatars',
  TASKS: 'tanatloc_tasks',
  LINKS: 'tanatloc_links'
}
