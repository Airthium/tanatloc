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

  it('tables', () => {
    expect(config.tables.SYSTEM).toBe('tanatloc_system')
    expect(config.tables.USERS).toBe('tanatloc_users')
    expect(config.tables.ORGANIZATIONS).toBe('tanatloc_organizations')
    expect(config.tables.GROUPS).toBe('tanatloc_groups')
    expect(config.tables.WORKSPACES).toBe('tanatloc_workspaces')
    expect(config.tables.PROJECTS).toBe('tanatloc_projects')
    expect(config.tables.GEOMETRIES).toBe('tanatloc_geometries')
    expect(config.tables.MESHES).toBe('tanatloc_meshes')
    expect(config.tables.SIMULATIONS).toBe('tanatloc_simulations')
    expect(config.tables.RESULTS).toBe('tanatloc_results')
    expect(config.tables.AVATARS).toBe('tanatloc_avatars')
    expect(config.tables.TASKS).toBe('tanatloc_tasks')
    expect(config.tables.LINKS).toBe('tanatloc_links')
  })
})
