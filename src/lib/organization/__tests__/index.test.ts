import Organization from '..'

const mockAdd = jest.fn()
const mockGet = jest.fn()
const mockGetAll = jest.fn()
const mockUpdate = jest.fn()
const mockDel = jest.fn()
jest.mock('@/database/organization', () => ({
  add: async () => mockAdd(),
  get: async () => mockGet(),
  getAll: async () => mockGetAll(),
  update: async () => mockUpdate(),
  del: async () => mockDel()
}))

const mockUserAdd = jest.fn()
const mockUserGet = jest.fn()
const mockUserGetWithData = jest.fn()
const mockUserGetBy = jest.fn()
const mockUserUpdate = jest.fn()
jest.mock('../../user', () => ({
  add: async () => mockUserAdd(),
  get: async () => mockUserGet(),
  getWithData: async () => mockUserGetWithData(),
  getBy: async () => mockUserGetBy(),
  update: async () => mockUserUpdate()
}))

const mockGroupGetWithData = jest.fn()
const mockGroupDel = jest.fn()
jest.mock('../../group', () => ({
  getWithData: async () => mockGroupGetWithData(),
  del: async () => mockGroupDel()
}))

jest.mock('../../email', () => ({
  invite: async () => jest.fn()
}))

describe('lib/organization', () => {
  beforeEach(() => {
    mockAdd.mockReset()
    mockGet.mockReset()
    mockGetAll.mockReset()
    mockUpdate.mockReset()
    mockDel.mockReset()

    mockUserAdd.mockReset()
    mockUserGet.mockReset()
    mockUserGetWithData.mockReset()
    mockUserGetBy.mockReset()
    mockUserUpdate.mockReset()

    mockGroupGetWithData.mockReset()
    mockGroupDel.mockReset()
  })

  test('add', async () => {
    mockAdd.mockImplementation(() => ({ id: 'id' }))
    const organization = await Organization.add({ id: 'id' }, { name: 'name' })
    expect(mockAdd).toHaveBeenCalledTimes(1)
    expect(mockUserUpdate).toHaveBeenCalledTimes(1)
    expect(organization).toEqual({ id: 'id' })
  })

  test('get', async () => {
    mockGet.mockImplementation(() => ({ name: 'name' }))
    let organization = await Organization.get('id', ['data'])
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(organization).toEqual({ name: 'name' })

    // With data
    organization = await Organization.get('id', [
      'owners',
      'pendingowners',
      'users',
      'pendingusers'
    ])
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(organization).toEqual({
      name: 'name',
      owners: [],
      pendingowners: [],
      users: [],
      pendingusers: []
    })

    // With values
    mockGet.mockImplementation(() => ({
      name: 'name',
      owners: [],
      pendingowners: [],
      users: [],
      pendingusers: []
    }))
    organization = await Organization.get('id', [
      'owners',
      'pendingowners',
      'users',
      'pendingusers'
    ])
    expect(mockGet).toHaveBeenCalledTimes(3)
    expect(organization).toEqual({
      name: 'name',
      owners: [],
      pendingowners: [],
      users: [],
      pendingusers: []
    })
  })

  test('getWithData', async () => {
    mockGet.mockImplementation(() => ({
      users: ['id'],
      pendingusers: ['id'],
      owners: ['id'],
      pendingowners: ['id'],
      groups: ['id']
    }))
    mockUserGetWithData.mockImplementation(() => ({
      id: 'id'
    }))
    mockGroupGetWithData.mockImplementation(() => ({
      id: 'id'
    }))
    let organization = await Organization.getWithData('id', ['data'])
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(organization).toEqual({
      owners: [{ id: 'id' }],
      pendingowners: [{ id: 'id' }],
      users: [{ id: 'id' }],
      pendingusers: [{ id: 'id' }],
      groups: [{ id: 'id' }]
    })

    // Without users, owners and groups
    mockGet.mockImplementation(() => ({}))
    organization = await Organization.getWithData('id', ['data'])
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(organization).toEqual({})
  })

  test('getByUsers', async () => {
    let organizations: any

    // Minimal
    mockGetAll.mockImplementation(() => [
      {
        name: 'name'
      },
      {
        name: 'name2'
      }
    ])
    organizations = await Organization.getByUser({ id: 'id1' }, ['name'])
    expect(mockGetAll).toHaveBeenCalledTimes(1)
    expect(organizations).toEqual([])

    organizations = await Organization.getByUser({ id: 'id1' }, [
      'name',
      'owners',
      'pendingowners',
      'users',
      'pendingusers',
      'groups'
    ])
    expect(mockGetAll).toHaveBeenCalledTimes(2)
    expect(organizations).toEqual([])

    // With owners, users
    mockGetAll.mockImplementation(() => [
      {
        name: 'name',
        owners: ['id1'],
        pendingowners: [],
        users: [],
        pendingusers: [],
        groups: []
      },
      {
        name: 'name2'
      }
    ])
    organizations = await Organization.getByUser({ id: 'id1' }, [
      'name',
      'owners',
      'pendingowners',
      'users',
      'pendingusers',
      'groups'
    ])
    expect(mockGetAll).toHaveBeenCalledTimes(3)
    expect(organizations).toEqual([
      {
        name: 'name',
        owners: [{ id: 'id1' }],
        pendingowners: [],
        users: [],
        pendingusers: [],
        groups: []
      }
    ])

    // With owners, users & groups
    mockGetAll.mockImplementation(() => [
      {
        name: 'name',
        owners: ['id1'],
        users: ['id2'],
        groups: ['id3']
      }
    ])
    mockUserGetWithData.mockImplementation(() => ({ firstname: 'firstname' }))
    mockGroupGetWithData.mockImplementation(() => ({ name: 'name' }))
    organizations = await Organization.getByUser({ id: 'id2' }, [
      'name',
      'owners',
      'users',
      'groups'
    ])
    expect(mockGetAll).toHaveBeenCalledTimes(4)
    expect(mockUserGetWithData).toHaveBeenCalledTimes(3)
    expect(mockGroupGetWithData).toHaveBeenCalledTimes(1)
    expect(organizations).toEqual([
      {
        name: 'name',
        owners: [
          {
            id: 'id1',
            firstname: 'firstname'
          }
        ],
        users: [
          {
            id: 'id2',
            firstname: 'firstname'
          }
        ],
        groups: [
          {
            id: 'id3',
            name: 'name'
          }
        ]
      }
    ])

    // With pending users only
    mockGetAll.mockImplementation(() => [
      {
        name: 'name',
        pendingusers: ['id1']
      }
    ])
    mockUserGetWithData.mockImplementation(() => ({ id: 'id1' }))
    organizations = await Organization.getByUser({ id: 'id1' }, [
      'name',
      'pendingusers'
    ])
    expect(mockGetAll).toHaveBeenCalledTimes(5)
    expect(organizations).toEqual([
      {
        name: 'name',
        pendingusers: [{ id: 'id1' }]
      }
    ])
  })

  test('update', async () => {
    mockUserGet.mockImplementation(() => ({}))

    // Minimal
    await Organization.update({ id: 'id' }, [{ key: 'key', value: 'value' }])
    expect(mockUpdate).toHaveBeenCalledTimes(1)

    // Minimal with ownerId
    await Organization.update(
      { id: 'id' },
      [{ key: 'key', value: 'value' }],
      'id'
    )
    expect(mockUpdate).toHaveBeenCalledTimes(2)

    // With existing users
    mockUserGetBy.mockImplementation(() => ({}))
    await Organization.update(
      { id: 'id' },
      [
        { key: 'owners', type: 'array', method: 'append', value: 'email' },
        { key: 'users', type: 'array', method: 'append', value: 'email' }
      ],
      'id'
    )
    expect(mockUpdate).toHaveBeenCalledTimes(3)

    // With non-existing users
    mockUserAdd.mockImplementation(() => ({}))
    mockUserGetBy.mockImplementation(() => {
      // Empty mock
    })
    await Organization.update(
      { id: 'id' },
      [
        { key: 'owners', type: 'array', method: 'append', value: 'email' },
        { key: 'users', type: 'array', method: 'append', value: 'email' }
      ],
      'id'
    )
    expect(mockUpdate).toHaveBeenCalledTimes(4)
    expect(mockUserAdd).toHaveBeenCalledTimes(2)
  })

  test('del', async () => {
    // Minimal
    mockGet.mockImplementation(() => ({ name: 'name' }))
    await Organization.del({ id: 'id' })
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockDel).toHaveBeenCalledTimes(1)

    // With owners, users & groups
    mockGet.mockImplementation(() => ({
      name: 'name',
      owners: ['id'],
      users: ['id'],
      groups: ['id']
    }))
    await Organization.del({ id: 'id' })
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockUserUpdate).toHaveBeenCalledTimes(2)
    expect(mockGroupDel).toHaveBeenCalledTimes(1)
    expect(mockDel).toHaveBeenCalledTimes(2)
  })

  test('accept', async () => {
    // pending owner
    mockGet.mockImplementation(() => ({
      pendingowners: ['id'],
      pendingusers: []
    }))
    await Organization.accept({ id: 'id' }, { id: 'id' })
    expect(mockUpdate).toHaveBeenCalledTimes(1)

    // pending user
    mockGet.mockImplementation(() => ({
      pendingowners: [],
      pendingusers: ['id']
    }))
    await Organization.accept({ id: 'id' }, { id: 'id' })
    expect(mockUpdate).toHaveBeenCalledTimes(2)

    // No invatation
    mockGet.mockImplementation(() => ({}))
    try {
      await Organization.accept({ id: 'id' }, { id: 'id' })
      expect(true).toBe(false)
    } catch (err) {
      expect(err.message).toBe('User has no invitation in this organization')
    }
  })

  test('decline', async () => {
    // pending owner
    mockGet.mockImplementation(() => ({
      pendingowners: ['id'],
      pendingusers: []
    }))
    await Organization.decline({ id: 'id' }, { id: 'id' })
    expect(mockUpdate).toHaveBeenCalledTimes(1)

    // pending user
    mockGet.mockImplementation(() => ({
      pendingowners: [],
      pendingusers: ['id']
    }))
    await Organization.decline({ id: 'id' }, { id: 'id' })
    expect(mockUpdate).toHaveBeenCalledTimes(2)

    // No invatation
    mockGet.mockImplementation(() => ({}))
    try {
      await Organization.decline({ id: 'id' }, { id: 'id' })
      expect(true).toBe(false)
    } catch (err) {
      expect(err.message).toBe('User has no invitation in this organization')
    }
  })

  test('quit', async () => {
    // No user
    mockGet.mockImplementation(() => ({}))
    try {
      await Organization.quit({ id: 'id' }, { id: 'id' })
      expect(true).toBe(false)
    } catch (err) {
      expect(err.message).toBe('User is not in this organization')
    }

    // User
    mockGet.mockImplementation(() => ({ users: ['id'] }))
    await Organization.quit({ id: 'id' }, { id: 'id' })
    expect(mockUpdate).toHaveBeenCalledTimes(1)
  })
})
