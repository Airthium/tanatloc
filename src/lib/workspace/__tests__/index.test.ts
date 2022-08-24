import Workspace from '../'

const mockAdd = jest.fn()
const mockGet = jest.fn()
const mockUpdate = jest.fn()
const mockDelete = jest.fn()
jest.mock('@/database/workspace', () => {
  return {
    add: async () => mockAdd(),
    get: async () => mockGet(),
    update: async () => mockUpdate(),
    del: async () => mockDelete()
  }
})

const mockUserGet = jest.fn()
const mockUserUpdate = jest.fn()
jest.mock('../../user', () => ({
  get: async () => mockUserGet(),
  getWithData: async () => mockUserGet(),
  update: async () => mockUserUpdate()
}))

const mockGroupGet = jest.fn()
const mockGroupUpdate = jest.fn()
jest.mock('../../group', () => ({
  get: async () => mockGroupGet(),
  getWithData: async () => mockGroupGet(),
  update: async () => mockGroupUpdate()
}))

const mockOrganizationGet = jest.fn()
const mockOrganizationGetByUser = jest.fn()
jest.mock('../../organization', () => ({
  get: async () => mockOrganizationGet(),
  getByUser: async () => mockOrganizationGetByUser()
}))

const mockDelProject = jest.fn()
jest.mock('../../project', () => ({
  del: async () => mockDelProject()
}))

describe('lib/workspace', () => {
  beforeEach(() => {
    mockAdd.mockReset()
    mockGet.mockReset()
    mockUpdate.mockReset()
    mockDelete.mockReset()

    mockUserGet.mockReset()
    mockUserUpdate.mockReset()
    mockGroupGet.mockReset()

    mockGroupGet.mockReset()
    mockGroupUpdate.mockReset()

    mockOrganizationGet.mockReset()

    mockDelProject.mockReset()
  })

  test('add', async () => {
    mockAdd.mockImplementation(() => ({
      id: 'id'
    }))
    const workspace = await Workspace.add({ id: 'id' }, { name: 'name' })
    expect(mockAdd).toHaveBeenCalledTimes(1)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDelete).toHaveBeenCalledTimes(0)
    expect(mockUserGet).toHaveBeenCalledTimes(0)
    expect(mockUserUpdate).toHaveBeenCalledTimes(1)
    expect(mockDelProject).toHaveBeenCalledTimes(0)
    expect(workspace).toEqual({ id: 'id' })
  })

  test('get', async () => {
    mockGet.mockImplementation(() => ({
      name: 'name'
    }))
    let workspace = await Workspace.get('id', [
      'name',
      'owners',
      'users',
      'groups',
      'projects',
      'archivedprojects'
    ])
    expect(workspace).toEqual({
      name: 'name',
      owners: [],
      users: [],
      groups: [],
      projects: [],
      archivedprojects: []
    })

    mockGet.mockImplementation(() => ({
      name: 'name',
      owners: [],
      users: [],
      groups: [],
      projects: [],
      archivedprojects: []
    }))
    workspace = await Workspace.get('id', [
      'name',
      'owners',
      'users',
      'groups',
      'projects',
      'archivedprojects'
    ])
    expect(workspace).toEqual({
      name: 'name',
      owners: [],
      users: [],
      groups: [],
      projects: [],
      archivedprojects: []
    })
  })

  test('getWithData', async () => {
    let workspace

    mockGet.mockImplementation(() => ({
      name: 'name'
    }))
    workspace = await Workspace.getWithData('id', ['name'])
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDelete).toHaveBeenCalledTimes(0)
    expect(mockUserGet).toHaveBeenCalledTimes(0)
    expect(mockUserUpdate).toHaveBeenCalledTimes(0)
    expect(mockDelProject).toHaveBeenCalledTimes(0)
    expect(workspace).toEqual({ name: 'name' })

    // With owners and users
    mockGet.mockImplementation(() => ({
      name: 'name',
      owners: ['ownerid'],
      users: ['userid'],
      groups: ['groupid']
    }))
    mockUserGet.mockImplementation(() => ({
      email: 'email'
    }))
    mockGroupGet.mockImplementation(() => ({
      name: 'name'
    }))
    workspace = await Workspace.getWithData('id', ['name'])
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDelete).toHaveBeenCalledTimes(0)
    expect(mockUserGet).toHaveBeenCalledTimes(2)
    expect(mockUserUpdate).toHaveBeenCalledTimes(0)
    expect(mockDelProject).toHaveBeenCalledTimes(0)
    expect(workspace).toEqual({
      name: 'name',
      owners: [{ id: 'ownerid', email: 'email' }],
      users: [{ id: 'userid', email: 'email' }],
      groups: [{ id: 'groupid', name: 'name' }]
    })
  })

  test('getByUser', async () => {
    // With workspaces, organizations & groups
    mockUserGet.mockImplementation(() => ({
      workspaces: ['id', 'id'],
      projects: ['id']
    }))
    mockOrganizationGetByUser.mockImplementation(() => [
      {
        id: 'organizationid',
        groups: [{ id: 'groupid', name: 'name' }]
      }
    ])
    mockGroupGet.mockImplementation(() => ({
      id: 'groupid',
      name: 'name',
      users: ['id'],
      workspaces: ['id'],
      projects: ['projectid']
    }))
    mockGet.mockImplementation(() => ({
      name: 'name',
      owners: ['ownerid']
    }))
    const workspaces = await Workspace.getByUser({ id: 'id' })
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(3)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDelete).toHaveBeenCalledTimes(0)
    expect(mockUserGet).toHaveBeenCalledTimes(4)
    expect(mockUserUpdate).toHaveBeenCalledTimes(0)
    expect(mockDelProject).toHaveBeenCalledTimes(0)
    expect(workspaces).toEqual([
      {
        id: 'id',
        name: 'name',
        owners: [
          {
            id: 'ownerid',
            workspaces: ['id', 'id'],
            projects: ['id']
          }
        ],
        users: [],
        groups: [],
        projects: []
      },
      {
        id: 'id',
        name: 'name',
        owners: [
          {
            id: 'ownerid',
            workspaces: ['id', 'id'],
            projects: ['id']
          }
        ],
        users: [],
        groups: [],
        projects: []
      },
      {
        id: 'shared',
        name: 'Shared projects',
        owners: [],
        users: [],
        groups: [],
        projects: ['id'],
        archivedprojects: []
      },
      {
        id: 'id',
        name: 'name',
        owners: [
          {
            id: 'ownerid',
            workspaces: ['id', 'id'],
            projects: ['id']
          }
        ],
        users: [],
        groups: [],
        projects: []
      },
      {
        id: 'groupid',
        archivedprojects: [],
        groups: [{ id: 'groupid', name: 'name' }],
        name: 'Projects from name',
        owners: [],
        users: [],
        projects: ['projectid']
      }
    ])

    // With owners
    mockGet.mockImplementation(() => ({
      name: 'name',
      owners: ['ownerid']
    }))
    await Workspace.getByUser({ id: 'id' })
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(6)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDelete).toHaveBeenCalledTimes(0)
    expect(mockUserGet).toHaveBeenCalledTimes(8)
    expect(mockUserUpdate).toHaveBeenCalledTimes(0)
    expect(mockDelProject).toHaveBeenCalledTimes(0)

    // Without group data
    mockGroupGet.mockImplementation(() => ({
      workspaces: [],
      projects: [],
      users: ['id']
    }))
    await Workspace.getByUser({ id: 'id' })
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(8)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDelete).toHaveBeenCalledTimes(0)
    expect(mockUserGet).toHaveBeenCalledTimes(11)
    expect(mockUserUpdate).toHaveBeenCalledTimes(0)
    expect(mockDelProject).toHaveBeenCalledTimes(0)

    // Without group user
    mockGroupGet.mockImplementation(() => ({
      workspaces: [],
      projects: [],
      users: []
    }))
    await Workspace.getByUser({ id: 'id' })
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(10)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDelete).toHaveBeenCalledTimes(0)
    expect(mockUserGet).toHaveBeenCalledTimes(14)
    expect(mockUserUpdate).toHaveBeenCalledTimes(0)
    expect(mockDelProject).toHaveBeenCalledTimes(0)

    // Without groups
    mockOrganizationGet.mockImplementation(() => ({}))
    await Workspace.getByUser({ id: 'id' })
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(12)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDelete).toHaveBeenCalledTimes(0)
    expect(mockUserGet).toHaveBeenCalledTimes(17)
    expect(mockUserUpdate).toHaveBeenCalledTimes(0)
    expect(mockDelProject).toHaveBeenCalledTimes(0)

    // Without workspaces & organizations
    mockUserGet.mockImplementation(() => ({ workspaces: [], projects: [] }))

    await Workspace.getByUser({ id: 'id' })
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(12)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDelete).toHaveBeenCalledTimes(0)
    expect(mockUserGet).toHaveBeenCalledTimes(18)
    expect(mockUserUpdate).toHaveBeenCalledTimes(0)
    expect(mockDelProject).toHaveBeenCalledTimes(0)
  })

  test('update', async () => {
    mockGet.mockImplementation(() => ({}))
    await Workspace.update({ id: 'id' }, [])
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(mockDelete).toHaveBeenCalledTimes(0)
    expect(mockUserGet).toHaveBeenCalledTimes(0)
    expect(mockUserUpdate).toHaveBeenCalledTimes(0)
    expect(mockDelProject).toHaveBeenCalledTimes(0)

    // With groups & users
    mockGroupGet.mockImplementation(() => ({ workspaces: [], projects: [] }))
    mockUserGet.mockImplementation(() => ({ workspaces: [], projects: [] }))
    mockGet.mockImplementation(() => ({
      groups: ['groupid'],
      users: ['userid']
    }))
    await Workspace.update({ id: 'id' }, [
      { key: 'groups', value: ['id1'] },
      { key: 'users', value: ['id1'] }
    ])

    // Already in group & users
    mockGroupGet.mockImplementation(() => ({
      workspaces: ['id'],
      projects: []
    }))
    mockUserGet.mockImplementation(() => ({
      workspaces: ['id'],
      projects: []
    }))
    mockGet.mockImplementation(() => ({
      groups: ['groupid'],
      users: ['userid']
    }))
    await Workspace.update({ id: 'id' }, [
      { key: 'groups', value: ['id1'] },
      { key: 'users', value: ['id1'] }
    ])

    // Update name
    await Workspace.update({ id: 'id' }, [{ key: 'name', value: 'name' }])
  })

  test('del', async () => {
    // Without projects & groups
    mockGet.mockImplementation(() => ({}))
    await Workspace.del({ id: 'id' }, { id: 'id' })
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDelete).toHaveBeenCalledTimes(1)
    expect(mockUserGet).toHaveBeenCalledTimes(0)
    expect(mockUserUpdate).toHaveBeenCalledTimes(1)
    expect(mockDelProject).toHaveBeenCalledTimes(0)

    // With projects & groups
    mockGet.mockImplementation(() => ({ projects: ['id'], groups: ['id'] }))
    await Workspace.del({ id: 'id' }, { id: 'id' })
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDelete).toHaveBeenCalledTimes(2)
    expect(mockUserGet).toHaveBeenCalledTimes(0)
    expect(mockUserUpdate).toHaveBeenCalledTimes(2)
    expect(mockDelProject).toHaveBeenCalledTimes(1)
  })
})
