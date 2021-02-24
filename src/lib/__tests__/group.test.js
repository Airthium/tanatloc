import Group from '../group'

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

const mockUserGet = jest.fn()
const mockUserUpdate = jest.fn()
jest.mock('../user', () => ({
  get: async () => mockUserGet(),
  update: async () => mockUserUpdate()
}))

describe('src/lib/group', () => {
  beforeEach(() => {
    mockAdd.mockReset()
    mockGet.mockReset()
    mockGetAll.mockReset()
    mockUpdate.mockReset()
    mockDel.mockReset()

    mockUserGet.mockReset()
    mockUserUpdate.mockReset()
  })

  it('add', async () => {
    mockAdd.mockImplementation(() => ({ id: 'id' }))
    const group = await Group.add({ name: 'group', users: ['id'] })
    expect(group).toEqual({ id: 'id' })
    expect(mockAdd).toHaveBeenCalledTimes(1)
    expect(mockUserUpdate).toHaveBeenCalledTimes(1)
  })

  it('get', async () => {
    mockGet.mockImplementation(() => ({ id: 'id' }))
    const group = await Group.get('id', ['data'])
    expect(group).toEqual({ id: 'id' })
    expect(mockGet).toHaveBeenCalledTimes(1)
  })

  it('getAll', async () => {
    // Normal
    mockGetAll.mockImplementation(() => [
      {
        id: 'id',
        name: 'name',
        users: ['id']
      }
    ])
    mockUserGet.mockImplementation(() => ({
      firstname: 'firstname'
    }))
    const groups = await Group.getAll(['data'])
    expect(mockGetAll).toHaveBeenCalledTimes(1)
    expect(groups).toEqual([
      { id: 'id', name: 'name', users: [{ id: 'id', firstname: 'firstname' }] }
    ])
  })

  it('update', async () => {
    await Group.update({}, [{}])
    expect(mockUpdate).toHaveBeenCalledTimes(1)

    // With added & delete users
    mockGet.mockImplementation(() => ({ users: ['id1'] }))
    await Group.update({}, [{ key: 'users', value: ['id0'] }])
    expect(mockUpdate).toHaveBeenCalledTimes(2)
    expect(mockUserUpdate).toHaveBeenCalledTimes(2)
  })

  it('del', async () => {
    mockGet.mockImplementation(() => ({
      users: [{}]
    }))
    await Group.del({})
    expect(mockDel).toHaveBeenCalledTimes(1)
    expect(mockUserUpdate).toHaveBeenCalledTimes(1)
  })
})
