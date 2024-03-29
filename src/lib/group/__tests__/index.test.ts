import Group from '../'

const mockAdd = jest.fn()
const mockGet = jest.fn()
const mockGetAll = jest.fn()
const mockUpdate = jest.fn()
const mockDel = jest.fn()
jest.mock('@/database/group', () => {
  return {
    add: async () => mockAdd(),
    get: async () => mockGet(),
    getAll: async () => mockGetAll(),
    update: async () => mockUpdate(),
    del: async () => mockDel()
  }
})

const mockUserGetWithData = jest.fn()
const mockUserUpdate = jest.fn()
jest.mock('../../user', () => ({
  getWithData: async () => mockUserGetWithData(),
  update: async () => mockUserUpdate()
}))

const mockWorkspaceGetWithData = jest.fn()
const mockWorkspaceUpdate = jest.fn()
jest.mock('../../workspace', () => ({
  getWithData: async () => mockWorkspaceGetWithData(),
  update: async () => mockWorkspaceUpdate()
}))

const mockProjectGetWithData = jest.fn()
const mockProjectUpdate = jest.fn()
jest.mock('../../project', () => ({
  getWithData: async () => mockProjectGetWithData(),
  update: async () => mockProjectUpdate()
}))

const mockUserModelGetWithData = jest.fn()
const mockUserModelUpdate = jest.fn()
jest.mock('../../userModel', () => ({
  getWithData: async () => mockUserModelGetWithData(),
  update: async () => mockUserModelUpdate()
}))

const mockOrganizationGet = jest.fn()
const mockOrganizationUpdate = jest.fn()
jest.mock('../../organization', () => ({
  get: async () => mockOrganizationGet(),
  update: async () => mockOrganizationUpdate()
}))

describe('lib/group', () => {
  beforeEach(() => {
    mockAdd.mockReset()
    mockGet.mockReset()
    mockGetAll.mockReset()
    mockUpdate.mockReset()
    mockDel.mockReset()

    mockUserGetWithData.mockReset()
    mockUserUpdate.mockReset()

    mockWorkspaceGetWithData.mockReset()
    mockWorkspaceUpdate.mockReset()

    mockProjectGetWithData.mockReset()
    mockProjectUpdate.mockReset()

    mockUserModelGetWithData.mockReset()
    mockUserModelUpdate.mockReset()

    mockOrganizationGet.mockReset()
    mockOrganizationUpdate.mockReset()
  })

  test('add', async () => {
    mockAdd.mockImplementation(() => ({ id: 'id' }))
    const group = await Group.add(
      { id: 'id' },
      { name: 'group', users: ['id'] }
    )
    expect(group).toEqual({ id: 'id' })
    expect(mockAdd).toHaveBeenCalledTimes(1)
    expect(mockOrganizationUpdate).toHaveBeenCalledTimes(1)
  })

  test('get', async () => {
    mockGet.mockImplementation(() => ({ id: 'id', users: ['id'] }))
    const group = await Group.get('id', ['users'])
    expect(group).toEqual({
      id: 'id',
      users: ['id']
    })
    expect(mockGet).toHaveBeenCalledTimes(1)

    // Undefined
    mockGet.mockImplementation(() => undefined)
    await Group.get('id', ['users'])
    expect(mockGet).toHaveBeenCalledTimes(2)
  })

  test('getWithData', async () => {
    // Undefined
    mockGet.mockImplementation(() => undefined)
    await Group.getWithData('id', ['users'])
    expect(mockGet).toHaveBeenCalledTimes(1)

    // With users, workspace, projects, usermodels
    mockGet.mockImplementation(() => ({
      id: 'id',
      users: ['id1', 'id2'],
      workspaces: ['id1', 'id2'],
      projects: ['id1', 'id2'],
      usermodels: ['id1', 'id2']
    }))
    mockUserGetWithData
      .mockImplementationOnce(() => undefined)
      .mockImplementationOnce(() => ({}))
    mockWorkspaceGetWithData
      .mockImplementationOnce(() => undefined)
      .mockImplementationOnce(() => ({}))
    mockProjectGetWithData
      .mockImplementationOnce(() => undefined)
      .mockImplementationOnce(() => ({}))
    mockUserModelGetWithData
      .mockImplementationOnce(() => undefined)
      .mockImplementationOnce(() => ({}))
    await Group.getWithData('id', ['users'])
  })

  test('getAll', async () => {
    let groups

    // Empty
    mockGetAll.mockImplementation(() => [])
    groups = await Group.getAll(['name'])
    expect(mockGetAll).toHaveBeenCalledTimes(1)
    expect(groups).toEqual([])

    // Users only
    mockGetAll.mockImplementation(() => [
      {
        users: ['id']
      },
      {}
    ])
    mockUserGetWithData.mockImplementation(() => ({
      firstname: 'firstname'
    }))
    groups = await Group.getAll(['users'])
    expect(mockGetAll).toHaveBeenCalledTimes(2)
    expect(mockUserGetWithData).toHaveBeenCalledTimes(1)
    expect(groups).toEqual([
      { users: [{ firstname: 'firstname' }] },
      { users: [] }
    ])

    // With data
    mockGetAll.mockImplementation(() => [
      {
        name: 'name',
        users: ['id']
      }
    ])
    groups = await Group.getAll([
      'users',
      'workspaces',
      'projects',
      'usermodels'
    ])
    expect(mockGetAll).toHaveBeenCalledTimes(3)
    expect(mockUserGetWithData).toHaveBeenCalledTimes(2)
    expect(groups).toEqual([
      {
        name: 'name',
        users: [{ firstname: 'firstname' }],
        workspaces: [],
        projects: [],
        usermodels: []
      }
    ])

    // With all data
    mockGetAll.mockImplementation(() => [
      {
        name: 'name',
        users: ['id'],
        workspaces: [],
        projects: [],
        usermodels: []
      }
    ])
    groups = await Group.getAll([
      'users',
      'workspaces',
      'projects',
      'usermodels'
    ])
    expect(mockGetAll).toHaveBeenCalledTimes(4)
    expect(mockUserGetWithData).toHaveBeenCalledTimes(3)
    expect(groups).toEqual([
      {
        name: 'name',
        users: [{ firstname: 'firstname' }],
        workspaces: [],
        projects: [],
        usermodels: []
      }
    ])
  })

  test('getByOrganization', async () => {
    let groups

    // Minimal
    mockOrganizationGet.mockImplementation(() => ({
      groups: ['id']
    }))
    mockGet.mockImplementation(() => ({
      name: 'name'
    }))
    groups = await Group.getByOrganization('id', ['name'])
    expect(mockOrganizationGet).toHaveBeenCalledTimes(1)
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(groups).toEqual([{ name: 'name' }])

    // With users
    mockGet.mockImplementation(() => ({
      name: 'name',
      users: ['id']
    }))
    mockUserGetWithData.mockImplementation(() => ({ firstname: 'firstname' }))
    groups = await Group.getByOrganization('id', ['name', 'users'])
    expect(mockOrganizationGet).toHaveBeenCalledTimes(2)
    expect(mockUserGetWithData).toHaveBeenCalledTimes(1)
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(groups).toEqual([
      { name: 'name', users: [{ firstname: 'firstname' }] }
    ])

    // No organization
    mockOrganizationGet.mockImplementation(() => undefined)
    await Group.getByOrganization('id', ['name'])

    // Undefined
    mockOrganizationGet.mockImplementation(() => ({ groups: ['id1'] }))
    mockGet.mockImplementation(() => undefined)
    await Group.getByOrganization('id', ['name'])
  })

  test('update', async () => {
    await Group.update({ id: 'id' }, [{ key: 'key', value: 'value' }])
    expect(mockUpdate).toHaveBeenCalledTimes(1)
  })

  test('del', async () => {
    // Minimal
    mockGet.mockImplementation(() => ({}))
    await Group.del({ id: 'id' })
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockOrganizationUpdate).toHaveBeenCalledTimes(1)
    expect(mockWorkspaceUpdate).toHaveBeenCalledTimes(0)
    expect(mockProjectUpdate).toHaveBeenCalledTimes(0)
    expect(mockUserModelUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(1)

    // With workspaces & projects
    mockGet.mockImplementation(() => ({
      users: ['id'],
      workspaces: ['id'],
      projects: ['id'],
      usermodels: ['id']
    }))
    await Group.del({ id: 'id' })
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockOrganizationUpdate).toHaveBeenCalledTimes(2)
    expect(mockWorkspaceUpdate).toHaveBeenCalledTimes(1)
    expect(mockProjectUpdate).toHaveBeenCalledTimes(1)
    expect(mockUserModelUpdate).toHaveBeenCalledTimes(1)
    expect(mockDel).toHaveBeenCalledTimes(2)

    // Undefined
    mockGet.mockImplementation(() => undefined)
    await Group.del({ id: 'id' })
  })
})
