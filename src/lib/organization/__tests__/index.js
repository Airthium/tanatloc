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

const mockUserGet = jest.fn()
const mockUserUpdate = jest.fn()
jest.mock('../../user', () => ({
  get: async () => mockUserGet(),
  update: async () => mockUserUpdate()
}))

const mockGroupGet = jest.fn()
const mockGroupDel = jest.fn()
jest.mock('../../group', () => ({
  get: async () => mockGroupGet(),
  del: async () => mockGroupDel()
}))

describe('lib/organization', () => {
  beforeEach(() => {
    mockAdd.mockReset()
    mockGet.mockReset()
    mockGetAll.mockReset()
    mockUpdate.mockReset()
    mockDel.mockReset()

    mockUserGet.mockReset()
    mockUserUpdate.mockReset()

    mockGroupGet.mockReset()
    mockGroupDel.mockReset()
  })

  it('add', async () => {
    mockAdd.mockImplementation(() => ({ id: 'id' }))
    const organization = await Organization.add({}, {})
    expect(mockAdd).toHaveBeenCalledTimes(1)
    expect(mockUserUpdate).toHaveBeenCalledTimes(1)
    expect(organization).toEqual({ id: 'id' })
  })

  it('get', async () => {
    mockGet.mockImplementation(() => ({ name: 'name' }))
    const organization = await Organization.get('id', ['data'])
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(organization).toEqual({ name: 'name' })
  })

  it('getByUsers', async () => {
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

  it('update', async () => {
    // TODO
  })

  it('del', async () => {
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
