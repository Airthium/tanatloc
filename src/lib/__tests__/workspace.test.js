import { add, get, getByUser, update, del } from '../workspace'

const mockAdd = jest.fn()
const mockGet = jest.fn()
const mockUpdate = jest.fn()
const mockDelete = jest.fn()
jest.mock('../../database/workspace', () => {
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

describe('src/lib/workspace', () => {
  beforeEach(() => {
    mockAdd.mockReset()
    mockGet.mockReset()
    mockUpdate.mockReset()
    mockDelete.mockReset()

    mockUserGet.mockReset()
    mockUserUpdate.mockReset()
  })

  it('add', async () => {
    mockAdd.mockImplementation(() => ({
      id: 'id'
    }))
    const workspace = await add({}, {})
    expect(mockAdd).toHaveBeenCalledTimes(1)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDelete).toHaveBeenCalledTimes(0)
    expect(mockUserGet).toHaveBeenCalledTimes(0)
    expect(mockUserUpdate).toHaveBeenCalledTimes(1)
    expect(workspace).toEqual({ id: 'id' })
  })

  it('get', async () => {
    mockGet.mockImplementation(() => ({
      name: 'name'
    }))
    const workspace = await get()
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDelete).toHaveBeenCalledTimes(0)
    expect(mockUserGet).toHaveBeenCalledTimes(0)
    expect(mockUserUpdate).toHaveBeenCalledTimes(0)
    expect(workspace).toEqual({ name: 'name' })
  })

  it('getByUser', async () => {
    mockUserGet.mockImplementation(() => ({
      workspaces: ['id', 'id']
    }))
    mockGet.mockImplementation(() => ({
      name: 'name'
    }))
    const workspaces = await getByUser({})
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDelete).toHaveBeenCalledTimes(0)
    expect(mockUserGet).toHaveBeenCalledTimes(1)
    expect(mockUserUpdate).toHaveBeenCalledTimes(0)
    expect(workspaces).toEqual([
      { id: 'id', name: 'name' },
      { id: 'id', name: 'name' }
    ])
  })

  it('update', async () => {
    await update({ workspace: {} })
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(mockDelete).toHaveBeenCalledTimes(0)
    expect(mockUserGet).toHaveBeenCalledTimes(0)
    expect(mockUserUpdate).toHaveBeenCalledTimes(0)
  })

  it('del', async () => {
    await del({}, {})
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDelete).toHaveBeenCalledTimes(1)
    expect(mockUserGet).toHaveBeenCalledTimes(0)
    expect(mockUserUpdate).toHaveBeenCalledTimes(1)
  })
})
