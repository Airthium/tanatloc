import Workspace from '../workspace'

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
jest.mock('../user', () => ({
  get: async () => mockUserGet(),
  update: async () => mockUserUpdate()
}))

const mockGroupGet = jest.fn()
jest.mock('../group', () => ({
  get: async () => mockGroupGet()
}))

const mockDelProject = jest.fn()
jest.mock('../project', () => ({
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
    mockUserGet.mockImplementation(() => ({
      workspaces: ['id', 'id']
    }))
    mockGet.mockImplementation(() => ({
      name: 'name'
    }))
    let workspaces = await Workspace.getByUser({})
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDelete).toHaveBeenCalledTimes(0)
    expect(mockUserGet).toHaveBeenCalledTimes(1)
    expect(mockUserUpdate).toHaveBeenCalledTimes(0)
    expect(mockDelProject).toHaveBeenCalledTimes(0)
    expect(workspaces).toEqual([
      { id: 'id', name: 'name' },
      { id: 'id', name: 'name' }
    ])

    // Without workspaces
    mockUserGet.mockImplementation(() => ({}))
    workspaces = await Workspace.getByUser({})
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDelete).toHaveBeenCalledTimes(0)
    expect(mockUserGet).toHaveBeenCalledTimes(2)
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
  })

  it('del', async () => {
    // Without users
    mockGet.mockImplementation(() => ({}))
    await Workspace.del({}, {})
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDelete).toHaveBeenCalledTimes(1)
    expect(mockUserGet).toHaveBeenCalledTimes(0)
    expect(mockUserUpdate).toHaveBeenCalledTimes(1)
    expect(mockDelProject).toHaveBeenCalledTimes(0)

    // With users
    mockGet.mockImplementation(() => ({ projects: ['id'] }))
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
