import { login, add, get, update, del } from '../user'

const mockGet = jest.fn()
const mockGetByUsernameAndPassword = jest.fn()
const mockUpdate = jest.fn()
const mockDel = jest.fn()
jest.mock('../../database/user', () => {
  return {
    add: async () => ({ id: 'id' }),
    get: async () => mockGet(),
    getByUsernameAndPassword: async () => mockGetByUsernameAndPassword(),
    update: async () => mockUpdate(),
    del: async () => mockDel()
  }
})

const mockReadAvatar = jest.fn()
jest.mock('../avatar', () => ({
  read: async () => mockReadAvatar()
}))

describe('src/lib/user', () => {
  beforeEach(() => {
    mockGet.mockReset()
    mockGetByUsernameAndPassword.mockReset()
    mockUpdate.mockReset()
    mockDel.mockReset()
    mockReadAvatar.mockReset()
  })

  it('add', async () => {
    const user = await add({ username: 'username', password: 'password' })
    expect(user).toEqual({ id: 'id' })
  })

  it('get', async () => {
    let user

    // Normal
    mockGet.mockImplementation(() => ({
      id: 'id',
      username: 'username'
    }))
    user = await get('id', [])
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockGetByUsernameAndPassword).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockReadAvatar).toHaveBeenCalledTimes(0)
    expect(user).toEqual({ id: 'id', username: 'username' })

    // With avatar
    mockGet.mockImplementation(() => ({
      id: 'id',
      username: 'username',
      avatar: 'avatar'
    }))
    mockReadAvatar.mockImplementation(() => 'avatar')
    user = await get('id')
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockGetByUsernameAndPassword).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockReadAvatar).toHaveBeenCalledTimes(1)
    expect(user).toEqual({ id: 'id', username: 'username', avatar: 'avatar' })

    mockReadAvatar.mockImplementation(() => {
      throw new Error('test')
    })
    user = await get('id')
    expect(mockGet).toHaveBeenCalledTimes(3)
    expect(mockGetByUsernameAndPassword).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockReadAvatar).toHaveBeenCalledTimes(2)
    expect(user).toEqual({ id: 'id', username: 'username', avatar: undefined })
  })

  it('login', async () => {
    let user

    // Empty
    user = await login({ username: 'username' })
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockGetByUsernameAndPassword).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockReadAvatar).toHaveBeenCalledTimes(0)
    expect(user).toBe(null)

    // Logged
    mockGetByUsernameAndPassword.mockImplementation(() => ({
      id: 'id',
      username: 'username'
    }))
    user = await login({ username: 'username' })
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockGetByUsernameAndPassword).toHaveBeenCalledTimes(2)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockReadAvatar).toHaveBeenCalledTimes(0)
    expect(user).toEqual({ id: 'id', username: 'username' })
  })

  it('update', async () => {
    await update({}, [])
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockGetByUsernameAndPassword).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockReadAvatar).toHaveBeenCalledTimes(0)
  })

  it('del', async () => {
    await del({})
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockGetByUsernameAndPassword).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(1)
    expect(mockReadAvatar).toHaveBeenCalledTimes(0)
  })
})
