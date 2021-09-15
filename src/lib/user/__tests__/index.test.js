import User from '../'

const mockAdd = jest.fn()
const mockGet = jest.fn()
const mockGetAll = jest.fn()
const mockGetByUsernameAndPassword = jest.fn()
const mockUpdate = jest.fn()
const mockDel = jest.fn()
jest.mock('@/database/user', () => {
  return {
    add: async () => mockAdd(),
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

const mockEmailSubscribe = jest.fn()
const mockEmailRevalidate = jest.fn()
jest.mock('../../email', () => ({
  subscribe: async () => mockEmailSubscribe(),
  revalidate: async () => mockEmailRevalidate()
}))

describe('lib/user', () => {
  beforeEach(() => {
    mockAdd.mockReset()
    mockAdd.mockImplementation(() => ({ id: 'id' }))
    mockGet.mockReset()
    mockGetAll.mockReset()
    mockGetByUsernameAndPassword.mockReset()
    mockUpdate.mockReset()
    mockDel.mockReset()

    mockReadAvatar.mockReset()
    mockDelAvatar.mockReset()

    mockDelWorkspace.mockReset()

    mockUpdateGroup.mockReset()

    mockEmailSubscribe.mockReset()
    mockEmailRevalidate.mockReset()
  })

  test('add', async () => {
    let user = await User.add({ email: 'email', password: 'password' })
    expect(mockEmailSubscribe).toHaveBeenCalledTimes(1)
    expect(user).toEqual({ id: 'id' })

    // Already exists
    mockAdd.mockImplementation(() => ({ id: 'id', alreadyExists: true }))
    user = await User.add({ email: 'email', password: 'password' })
    expect(mockEmailSubscribe).toHaveBeenCalledTimes(1)
    expect(user).toEqual({ id: 'id', alreadyExists: true })
  })

  test('get', async () => {
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

  test('getBy', async () => {
    mockGet.mockImplementation(() => ({
      id: 'id'
    }))
    const user = await User.getBy('email', ['id'], 'email')
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(user).toEqual({ id: 'id' })
  })

  test('getAll', async () => {
    mockGetAll.mockImplementation(() => [{ id: 'id' }])
    const users = await User.getAll()
    expect(mockGetAll).toHaveBeenCalledTimes(1)
    expect(users).toEqual([{ id: 'id' }])
  })

  test('login', async () => {
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

  test('update', async () => {
    await User.update({}, [])
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockGetByUsernameAndPassword).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockReadAvatar).toHaveBeenCalledTimes(0)
    expect(mockDelWorkspace).toHaveBeenCalledTimes(0)

    // With email
    await User.update({}, [{ key: 'email', value: 'email' }])
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockGetByUsernameAndPassword).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(2)
    expect(mockEmailRevalidate).toHaveBeenCalledTimes(1)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockReadAvatar).toHaveBeenCalledTimes(0)
    expect(mockDelWorkspace).toHaveBeenCalledTimes(0)
  })

  test('del', async () => {
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
