import Group from '../group'

const mockAdd = jest.fn()
const mockGetAll = jest.fn()
const mockUpdate = jest.fn()
const mockDel = jest.fn()
jest.mock('@/database/group', () => {
  return {
    add: async () => mockAdd(),
    getAll: async () => mockGetAll(),
    update: async () => mockUpdate(),
    del: async () => mockDel()
  }
})

const mockUserGet = jest.fn()
jest.mock('../user', () => ({
  get: async () => mockUserGet()
}))

describe('src/lib/group', () => {
  beforeEach(() => {
    mockAdd.mockReset()
    mockGetAll.mockReset()
    mockUpdate.mockReset()
    mockDel.mockReset()

    mockUserGet.mockReset()
  })

  it('add', async () => {
    mockAdd.mockImplementation(() => ({ id: 'id' }))
    const group = await Group.add({ name: 'group', users: ['id'] })
    expect(group).toEqual({ id: 'id' })
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
    await Group.update({}, [])
    expect(mockUpdate).toHaveBeenCalledTimes(1)
  })

  it('del', async () => {
    // Without workspaces
    await Group.del({})
    expect(mockDel).toHaveBeenCalledTimes(1)
  })
})
