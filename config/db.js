export default {
  USER: process.env.DB_USER || 'tanatlocuser',
  HOST: process.env.DB_HOST || 'localhost',
  PORT: process.env.DB_PORT || 5432,
  DATABASE: process.env.DB_DATABASE || 'tanatloc',
  PASSWORD: process.env.DB_PASSWORD || 'tanatloc'
}

export const databases = {
  USERS: 'tanatloc_users',
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
