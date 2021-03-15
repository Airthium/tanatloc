import User from '../'

const mockGet = jest.fn()
const mockGetAll = jest.fn()
const mockGetByUsernameAndPassword = jest.fn()
const mockUpdate = jest.fn()
const mockDel = jest.fn()
jest.mock('@/database/user', () => {
  return {
    add: async () => ({ id: 'id' }),
    get: async () => mockGet(),
    getAll: async () => mockGetAll(),
    getByUsernameAndPassword: async () => mockGetByUsernameAndPassword(),
    update: async () => mockUpdate(),
    del: async () => mockDel()
  }
})

const mockReadAvatar = jest.fn()
const mockDelAvatar = jest.fn()
jest.mock('../../avatar', () => ({
  read: async () => mockReadAvatar(),
  del: async () => mockDelAvatar()
}))

const mockDelWorkspace = jest.fn()
jest.mock('../../workspace', () => ({
  del: async () => mockDelWorkspace()
}))

const mockUpdateGroup = jest.fn()
jest.mock('../../group', () => ({
  update: async () => mockUpdateGroup()
}))

describe('lib/user', () => {
  beforeEach(() => {
    mockGet.mockReset()
    mockGetAll.mockReset()
    mockGetByUsernameAndPassword.mockReset()
    mockUpdate.mockReset()
    mockDel.mockReset()

    mockReadAvatar.mockReset()
    mockDelAvatar.mockReset()

    mockDelWorkspace.mockReset()

    mockUpdateGroup.mockReset()
  })

  it('add', async () => {
    const user = await User.add({ email: 'email', password: 'password' })
    expect(user).toEqual({ id: 'id' })
  })

  it('get', async () => {
    let user

    // Normal
    mockGet.mockImplementation(() => ({
      id: 'id',
      email: 'email'
    }))
    user = await User.get('id', [])
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockGetByUsernameAndPassword).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockReadAvatar).toHaveBeenCalledTimes(0)
    expect(mockDelAvatar).toHaveBeenCalledTimes(0)
    expect(mockDelWorkspace).toHaveBeenCalledTimes(0)
    expect(user).toEqual({ id: 'id', email: 'email' })

    // With avatar
    mockGet.mockImplementation(() => ({
      id: 'id',
      email: 'email',
      avatar: 'avatar'
    }))
    mockReadAvatar.mockImplementation(() => 'avatar')
    user = await User.get('id')
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockGetByUsernameAndPassword).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockReadAvatar).toHaveBeenCalledTimes(1)
    expect(mockDelAvatar).toHaveBeenCalledTimes(0)
    expect(mockDelWorkspace).toHaveBeenCalledTimes(0)
    expect(user).toEqual({ id: 'id', email: 'email', avatar: 'avatar' })

    mockReadAvatar.mockImplementation(() => {
      throw new Error('test')
    })
    user = await User.get('id')
    expect(mockGet).toHaveBeenCalledTimes(3)
    expect(mockGetByUsernameAndPassword).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockReadAvatar).toHaveBeenCalledTimes(2)
    expect(mockDelAvatar).toHaveBeenCalledTimes(0)
    expect(mockDelWorkspace).toHaveBeenCalledTimes(0)
    expect(user).toEqual({ id: 'id', email: 'email', avatar: undefined })
  })

  it('getAll', async () => {
    mockGetAll.mockImplementation(() => [{ id: 'id' }])
    const users = await User.getAll()
    expect(mockGetAll).toHaveBeenCalledTimes(1)
    expect(users).toEqual([{ id: 'id' }])
  })

  it('login', async () => {
    let user

    // Empty
    user = await User.login({ email: 'email' })
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockGetByUsernameAndPassword).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockReadAvatar).toHaveBeenCalledTimes(0)
    expect(mockDelAvatar).toHaveBeenCalledTimes(0)
    expect(mockDelWorkspace).toHaveBeenCalledTimes(0)
    expect(user).toBe(null)

    // Logged
    mockGetByUsernameAndPassword.mockImplementation(() => ({
      id: 'id',
      email: 'email'
    }))
    user = await User.login({ email: 'email' })
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockGetByUsernameAndPassword).toHaveBeenCalledTimes(2)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockReadAvatar).toHaveBeenCalledTimes(0)
    expect(mockDelAvatar).toHaveBeenCalledTimes(0)
    expect(mockDelWorkspace).toHaveBeenCalledTimes(0)
    expect(user).toEqual({ id: 'id', email: 'email' })
  })

  it('update', async () => {
    await User.update({}, [])
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockGetByUsernameAndPassword).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockReadAvatar).toHaveBeenCalledTimes(0)
    expect(mockDelWorkspace).toHaveBeenCalledTimes(0)
  })

  it('del', async () => {
    // Without workspaces & groups
    mockGet.mockImplementation(() => ({}))
    await User.del({})
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockGetByUsernameAndPassword).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(1)
    expect(mockReadAvatar).toHaveBeenCalledTimes(0)
    expect(mockDelAvatar).toHaveBeenCalledTimes(0)
    expect(mockDelWorkspace).toHaveBeenCalledTimes(0)

    // With workspaces, groups & avatar
    mockGet.mockImplementation(() => ({
      groups: ['id'],
      workspaces: ['id'],
      avatar: 'id'
    }))
    await User.del({})
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockGetByUsernameAndPassword).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(2)
    expect(mockReadAvatar).toHaveBeenCalledTimes(0)
    expect(mockDelAvatar).toHaveBeenCalledTimes(1)
    expect(mockDelWorkspace).toHaveBeenCalledTimes(1)
    expect(mockUpdateGroup).toHaveBeenCalledTimes(1)
  })
})
