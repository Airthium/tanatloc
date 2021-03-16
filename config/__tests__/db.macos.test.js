Object.defineProperty(process, 'platform', {
  value: 'darwin'
})
const config = require('../db')

describe('config/db', () => {
  it('global', () => {
    expect(config.ADMIN).toBe(process.env.USER)
    expect(config.ADMIN_DATABASE).toBe('postgres')
    expect(config.ADMIN_PASSWORD).toBe('')
    expect(config.USER).toBe('tanatlocuser')
    expect(config.HOST).toBe('localhost')
    expect(config.PORT).toBe(5432)
    expect(config.DATABASE).toBe('tanatloc2')
    expect(config.PASSWORD).toBe('tanatloc')
  })

  it('databases', () => {
    expect(config.databases.SYSTEM).toBe('tanatloc_system')
    expect(config.databases.USERS).toBe('tanatloc_users')
    expect(config.databases.ORGANIZATIONS).toBe('tanatloc_organizations')
    expect(config.databases.GROUPS).toBe('tanatloc_groups')
    expect(config.databases.WORKSPACES).toBe('tanatloc_workspaces')
    expect(config.databases.PROJECTS).toBe('tanatloc_projects')
    expect(config.databases.GEOMETRIES).toBe('tanatloc_geometries')
    expect(config.databases.MESHES).toBe('tanatloc_meshes')
    expect(config.databases.SIMULATIONS).toBe('tanatloc_simulations')
    expect(config.databases.RESULTS).toBe('tanatloc_results')
    expect(config.databases.AVATARS).toBe('tanatloc_avatars')
    expect(config.databases.TASKS).toBe('tanatloc_tasks')
    expect(config.databases.LINKS).toBe('tanatloc_links')
  })
})
