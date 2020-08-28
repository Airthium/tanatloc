import { add, get, getByUser, update, del } from '../workspace'
import { getByUsernameAndPassword } from '../../database/user'

const mockUpdate = jest.fn()
const mockDelete = jest.fn()
jest.mock('../../database/workspace', () => {
  return {
    add: async () => ({ id: 'id' }),
    get: async () => ({
      name: 'name'
    }),
    update: async () => mockUpdate(),
    del: async () => mockDelete()
  }
})

const mockUserUpdate = jest.fn()
jest.mock('../user', () => ({
  get: async () => ({ workspaces: ['id'] }),
  update: async () => mockUserUpdate()
}))

describe('src/lib/workspace', () => {
  it('add', async () => {
    const workspace = await add({}, {})
    expect(workspace).toEqual({ id: 'id' })
    expect(mockUserUpdate).toHaveBeenCalledTimes(1)
  })

  it('get', async () => {
    const workspace = await get()
    expect(workspace).toEqual({ name: 'name' })
  })

  it('getByUser', async () => {
    const workspaces = await getByUser({})
    expect(workspaces).toEqual([{ id: 'id', name: 'name' }])
  })

  it('update', async () => {
    await update({ workspace: {} })
    expect(mockUpdate).toHaveBeenCalledTimes(1)
  })

  it('del', async () => {
    await del({}, {})
    expect(mockDelete).toHaveBeenCalledTimes(1)
    expect(mockUserUpdate).toHaveBeenCalledTimes(2)
  })
})
