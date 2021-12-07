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

const mockWorkspaceUpdate = jest.fn()
jest.mock('../../workspace', () => ({
  update: async () => mockWorkspaceUpdate()
}))

const mockProjectUpdate = jest.fn()
jest.mock('../../project', () => ({
  update: async () => mockProjectUpdate()
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

    mockWorkspaceUpdate.mockReset()

    mockProjectUpdate.mockReset()

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
    const group = await Group.get('id', ['data'])
    expect(group).toEqual({
      id: 'id',
      users: ['id']
    })
    expect(mockGet).toHaveBeenCalledTimes(1)
  })

  test('getWithData', async () => {
    mockGet.mockImplementation(() => ({ id: 'id', users: ['id'] }))
    mockUserGetWithData.mockImplementation(() => ({ firstname: 'firstname' }))
    const group = await Group.getWithData('id', ['data'])
    expect(group).toEqual({
      id: 'id',
      users: [{ id: 'id', firstname: 'firstname' }]
    })
    expect(mockGet).toHaveBeenCalledTimes(1)
  })

  test('getAll', async () => {
    let groups

    // Users only
    mockGetAll.mockImplementation(() => [
      {
        users: ['id']
      }
    ])
    mockUserGetWithData.mockImplementation(() => ({
      firstname: 'firstname'
    }))
    groups = await Group.getAll(['users'])
    expect(mockGetAll).toHaveBeenCalledTimes(1)
    expect(mockUserGetWithData).toHaveBeenCalledTimes(1)
    expect(groups).toEqual([{ users: [{ id: 'id', firstname: 'firstname' }] }])

    // With data
    mockGetAll.mockImplementation(() => [
      {
        name: 'name',
        users: ['id']
      }
    ])
    groups = await Group.getAll(['data'])
    expect(mockGetAll).toHaveBeenCalledTimes(2)
    expect(mockUserGetWithData).toHaveBeenCalledTimes(2)
    expect(groups).toEqual([
      { name: 'name', users: [{ id: 'id', firstname: 'firstname' }] }
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
    groups = await Group.getByOrganization('id', ['data'])
    expect(mockOrganizationGet).toHaveBeenCalledTimes(1)
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(groups).toEqual([{ id: 'id', name: 'name' }])

    // With users
    mockGet.mockImplementation(() => ({
      name: 'name',
      users: ['id']
    }))
    mockUserGetWithData.mockImplementation(() => ({ firstname: 'firstname' }))
    groups = await Group.getByOrganization('id', ['data'])
    expect(mockOrganizationGet).toHaveBeenCalledTimes(2)
    expect(mockUserGetWithData).toHaveBeenCalledTimes(1)
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(groups).toEqual([
      { id: 'id', name: 'name', users: [{ id: 'id', firstname: 'firstname' }] }
    ])
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
    expect(mockDel).toHaveBeenCalledTimes(1)

    // With workspaces & projects
    mockGet.mockImplementation(() => ({
      users: ['id'],
      workspaces: ['id'],
      projects: ['id']
    }))
    await Group.del({ id: 'id' })
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockOrganizationUpdate).toHaveBeenCalledTimes(2)
    expect(mockWorkspaceUpdate).toHaveBeenCalledTimes(1)
    expect(mockProjectUpdate).toHaveBeenCalledTimes(1)
    expect(mockDel).toHaveBeenCalledTimes(2)
  })
})