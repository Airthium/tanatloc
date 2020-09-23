import { login, add, get, update, del } from '../user'

let mockGet = () => ({
  id: 'id',
  username: 'username'
})
const mockUpdate = jest.fn()
const mockDel = jest.fn()
jest.mock('../../database/user', () => {
  let count = 0
  return {
    add: async () => {},
    get: async () => mockGet(),
    getByUsernameAndPassword: async () => {
      count++
      if (count === 1) return
      return { id: 'id' }
    },
    update: async () => mockUpdate(),
    del: async () => mockDel()
  }
})

jest.mock('../avatar', () => ({
  read: async () => 'read'
}))

describe('src/lib/user', () => {
  it('get', async () => {
    let user

    user = await get('id')
    expect(user).toEqual({ id: 'id', username: 'username' })

    mockGet = () => ({
      id: 'id',
      username: 'username',
      avatar: 'avatar'
    })
    user = await get('id')
    expect(user).toEqual({ id: 'id', username: 'username', avatar: 'read' })
  })

  it('login', async () => {
    let user

    // Empty
    user = await login({ username: 'username' })
    expect(user).toBe(null)

    // Logged
    user = await login({ username: 'username' })
    expect(user).toEqual({ id: 'id', username: 'username' })
  })

  it('add', async () => {
    await add()
  })

  it('update', async () => {
    await update({}, { data: [] })
    expect(mockUpdate).toHaveBeenCalledTimes(1)
  })

  it('del', async () => {
    await del({})
    expect(mockDel).toHaveBeenCalledTimes(1)
  })
})
