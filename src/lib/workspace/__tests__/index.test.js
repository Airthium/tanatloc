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
  update: async () => mockUserUpdate()
}))

const mockGroupGet = jest.fn()
const mockGroupUpdate = jest.fn()
jest.mock('../../group', () => ({
  get: async () => mockGroupGet(),
  update: async () => mockGroupUpdate()
}))

const mockDelProject = jest.fn()
jest.mock('../../project', () => ({
  del: async () => mockDelProject()
}))

describe('src/lib/workspace', () => {
  beforeEach(() => {
    mockAdd.mockReset()
    mockGet.mockReset()
    mockUpdate.mockReset()
    mockDelete.mockReset()

    mockUserGet.mockReset()
    mockUserUpdate.mockReset()
    mockGroupGet.mockReset()
    mockDelProject.mockReset()

    mockGroupGet.mockReset()
    mockGroupUpdate.mockReset()
  })

  it('add', async () => {
    mockAdd.mockImplementation(() => ({
      id: 'id'
    }))
    const workspace = await Workspace.add({}, {})
    expect(mockAdd).toHaveBeenCalledTimes(1)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDelete).toHaveBeenCalledTimes(0)
    expect(mockUserGet).toHaveBeenCalledTimes(0)
    expect(mockUserUpdate).toHaveBeenCalledTimes(1)
    expect(mockDelProject).toHaveBeenCalledTimes(0)
    expect(workspace).toEqual({ id: 'id' })
  })

  it('get', async () => {
    let workspace

    mockGet.mockImplementation(() => ({
      name: 'name'
    }))
    workspace = await Workspace.get()
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
      owners: ['id'],
      users: ['id'],
      groups: ['id']
    }))
    mockUserGet.mockImplementation(() => ({
      username: 'username'
    }))
    mockGroupGet.mockImplementation(() => ({
      name: 'name'
    }))
    workspace = await Workspace.get()
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDelete).toHaveBeenCalledTimes(0)
    expect(mockUserGet).toHaveBeenCalledTimes(2)
    expect(mockUserUpdate).toHaveBeenCalledTimes(0)
    expect(mockDelProject).toHaveBeenCalledTimes(0)
    expect(workspace).toEqual({
      name: 'name',
      owners: [{ id: 'id', username: 'username' }],
      users: [{ id: 'id', username: 'username' }],
      groups: [{ id: 'id', name: 'name' }]
    })
  })

  it('getByUser', async () => {
    // With workspaces & groups
    let count = 0
    mockUserGet.mockImplementation(() => ({
      workspaces: ['id', 'id'],
      groups: ['id', 'id']
    }))
    mockGroupGet.mockImplementation(() => {
      count++
      return {
        workspaces: [count === 2 ? 'id1' : 'id'],
        projects: ['idp']
      }
    })
    mockGet.mockImplementation(() => ({
      name: 'name'
    }))
    let workspaces = await Workspace.getByUser({})
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(3)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDelete).toHaveBeenCalledTimes(0)
    expect(mockUserGet).toHaveBeenCalledTimes(1)
    expect(mockUserUpdate).toHaveBeenCalledTimes(0)
    expect(mockDelProject).toHaveBeenCalledTimes(0)
    expect(workspaces).toEqual([
      { id: 'id1', name: 'name' },
      { id: 'id', name: 'name' },
      { id: 'id', name: 'name' },
      {
        id: 0,
        name: 'Shared projects',
        owners: [],
        users: [
          {
            id: undefined,
            firstname: undefined,
            lastname: undefined,
            email: undefined,
            avatar: undefined
          }
        ],
        groups: [],
        projects: ['idp', 'idp']
      }
    ])

    // Without projects
    mockGroupGet.mockImplementation(() => ({}))
    workspaces = await Workspace.getByUser({})
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(5)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDelete).toHaveBeenCalledTimes(0)
    expect(mockUserGet).toHaveBeenCalledTimes(2)
    expect(mockUserUpdate).toHaveBeenCalledTimes(0)
    expect(mockDelProject).toHaveBeenCalledTimes(0)
    expect(workspaces).toEqual([
      { id: 'id', name: 'name' },
      { id: 'id', name: 'name' }
    ])

    // Without workspaces & groups
    mockUserGet.mockImplementation(() => ({}))

    workspaces = await Workspace.getByUser({})
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(5)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDelete).toHaveBeenCalledTimes(0)
    expect(mockUserGet).toHaveBeenCalledTimes(3)
    expect(mockUserUpdate).toHaveBeenCalledTimes(0)
    expect(mockDelProject).toHaveBeenCalledTimes(0)
    expect(workspaces).toEqual([])
  })

  it('update', async () => {
    mockGet.mockImplementation(() => ({}))
    await Workspace.update({ id: 'id' }, [])
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(mockDelete).toHaveBeenCalledTimes(0)
    expect(mockUserGet).toHaveBeenCalledTimes(0)
    expect(mockUserUpdate).toHaveBeenCalledTimes(0)
    expect(mockDelProject).toHaveBeenCalledTimes(0)

    // With groups
    mockGet.mockImplementation(() => ({
      groups: ['id']
    }))
    await Workspace.update({ id: 'id' }, [{ key: 'groups', value: ['id1'] }])
  })

  it('del', async () => {
    // Without projects & groups
    mockGet.mockImplementation(() => ({}))
    await Workspace.del({}, {})
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDelete).toHaveBeenCalledTimes(1)
    expect(mockUserGet).toHaveBeenCalledTimes(0)
    expect(mockUserUpdate).toHaveBeenCalledTimes(1)
    expect(mockDelProject).toHaveBeenCalledTimes(0)

    // With projects & groups
    mockGet.mockImplementation(() => ({ projects: ['id'], groups: ['id'] }))
    await Workspace.del({}, {})
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDelete).toHaveBeenCalledTimes(2)
    expect(mockUserGet).toHaveBeenCalledTimes(0)
    expect(mockUserUpdate).toHaveBeenCalledTimes(2)
    expect(mockDelProject).toHaveBeenCalledTimes(1)
  })
})
