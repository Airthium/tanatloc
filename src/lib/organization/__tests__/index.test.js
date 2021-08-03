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
  update: (async) => mockUpdate(),
  del: async () => mockDel()
}))

const mockUserAdd = jest.fn()
const mockUserGet = jest.fn()
const mockUserGetBy = jest.fn()
const mockUserUpdate = jest.fn()
jest.mock('../../user', () => ({
  add: async () => mockUserAdd(),
  get: async () => mockUserGet(),
  getBy: async () => mockUserGetBy(),
  update: async () => mockUserUpdate()
}))

const mockGroupGet = jest.fn()
const mockGroupDel = jest.fn()
jest.mock('../../group', () => ({
  get: async () => mockGroupGet(),
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
    mockUserGetBy.mockReset()
    mockUserUpdate.mockReset()

    mockGroupGet.mockReset()
    mockGroupDel.mockReset()
  })

  test('add', async () => {
    mockAdd.mockImplementation(() => ({ id: 'id' }))
    const organization = await Organization.add({}, {})
    expect(mockAdd).toHaveBeenCalledTimes(1)
    expect(mockUserUpdate).toHaveBeenCalledTimes(1)
    expect(organization).toEqual({ id: 'id' })
  })

  test('get', async () => {
    mockGet.mockImplementation(() => ({ name: 'name' }))
    const organization = await Organization.get('id', ['data'])
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(organization).toEqual({ name: 'name' })
  })

  test('getByUsers', async () => {
    let organizations

    // Minimal
    mockGetAll.mockImplementation(() => [
      {
        name: 'name',
        owners: ['id1'],
        users: ['id2']
      }
    ])
    organizations = await Organization.getByUser({ id: 'id1' }, ['name'])
    expect(mockGetAll).toHaveBeenCalledTimes(1)
    expect(organizations).toEqual([
      {
        name: 'name'
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
    mockUserGet.mockImplementation(() => ({ firstname: 'firstname' }))
    mockGroupGet.mockImplementation(() => ({ name: 'name' }))
    organizations = await Organization.getByUser({ id: 'id2' }, [
      'name',
      'owners',
      'users',
      'groups'
    ])
    expect(mockGetAll).toHaveBeenCalledTimes(2)
    expect(mockUserGet).toHaveBeenCalledTimes(2)
    expect(mockGroupGet).toHaveBeenCalledTimes(1)
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
  })

  test('update', async () => {
    // Minimal
    await Organization.update({}, [{ key: 'test' }])
    expect(mockUpdate).toHaveBeenCalledTimes(1)

    // With existing users
    mockUserGetBy.mockImplementation(() => ({}))
    await Organization.update({}, [
      { key: 'owners', type: 'array', method: 'append', value: 'email' },
      { key: 'users', type: 'array', method: 'append', value: 'email' }
    ])
    expect(mockUpdate).toHaveBeenCalledTimes(2)
    expect(mockUserUpdate).toHaveBeenCalledTimes(2)

    // With non-existing users
    mockUserAdd.mockImplementation(() => ({}))
    mockUserGetBy.mockImplementation(() => {})
    await Organization.update({}, [
      { key: 'owners', type: 'array', method: 'append', value: 'email' },
      { key: 'users', type: 'array', method: 'append', value: 'email' }
    ])
    expect(mockUpdate).toHaveBeenCalledTimes(3)
    expect(mockUserAdd).toHaveBeenCalledTimes(2)
    expect(mockUserUpdate).toHaveBeenCalledTimes(4)
  })

  test('del', async () => {
    // Minimal
    mockGet.mockImplementation(() => ({ name: 'name' }))
    await Organization.del({})
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockDel).toHaveBeenCalledTimes(1)

    // With owners, users & groups
    mockGet.mockImplementation(() => ({
      name: 'name',
      owners: ['id'],
      users: ['id'],
      groups: ['id']
    }))
    await Organization.del({})
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockUserUpdate).toHaveBeenCalledTimes(2)
    expect(mockGroupDel).toHaveBeenCalledTimes(1)
    expect(mockDel).toHaveBeenCalledTimes(2)
  })
})
