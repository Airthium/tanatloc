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

const mockAvatarRead = jest.fn()
const mockAvatarDel = jest.fn()
jest.mock('../../avatar', () => ({
  read: async () => mockAvatarRead(),
  del: async () => mockAvatarDel()
}))

const mockOrganizationGet = jest.fn()
const mockOrganizationUpdate = jest.fn()
jest.mock('../../organization', () => ({
  get: async () => mockOrganizationGet(),
  update: async () => mockOrganizationUpdate()
}))

const mockWorkspaceGet = jest.fn()
const mockWorkspaceDel = jest.fn()
jest.mock('../../workspace', () => ({
  get: async () => mockWorkspaceGet(),
  del: async () => mockWorkspaceDel()
}))

const mockProjectGet = jest.fn()
jest.mock('../../project', () => ({
  get: async () => mockProjectGet()
}))

const mockUserModelGet = jest.fn()
const mockUserModelDel = jest.fn()
jest.mock('../../userModel', () => ({
  getWithData: async () => mockUserModelGet(),
  del: async () => mockUserModelDel()
}))

const mockEmailSubscribe = jest.fn()
const mockEmailRevalidate = jest.fn()
jest.mock('../../email', () => ({
  subscribe: async () => mockEmailSubscribe(),
  revalidate: async () => mockEmailRevalidate()
}))

const mockSystemGet = jest.fn()
jest.mock('../../system', () => ({
  get: async () => mockSystemGet()
}))

const mockGroupUpdate = jest.fn()
jest.mock('../../group', () => ({
  update: async () => mockGroupUpdate()
}))

jest.mock('../../tools', () => ({
  decrypt: async (str: string) => str
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

    mockAvatarRead.mockReset()
    mockAvatarDel.mockReset()

    mockWorkspaceGet.mockReset()
    mockWorkspaceDel.mockReset()

    mockProjectGet.mockReset()

    mockUserModelGet.mockReset()
    mockUserModelDel.mockReset()

    mockOrganizationGet.mockReset()
    mockOrganizationUpdate.mockReset()

    mockEmailSubscribe.mockReset()
    mockEmailRevalidate.mockReset()

    mockSystemGet.mockReset()

    mockGroupUpdate.mockReset()
  })

  test('add', async () => {
    // No default plugins
    mockSystemGet.mockImplementation(() => ({}))
    let user = await User.add({ email: 'email', password: 'password' })
    expect(mockEmailSubscribe).toHaveBeenCalledTimes(1)
    expect(user).toEqual({ id: 'id' })

    // Default plugins
    mockSystemGet.mockImplementation(() => ({ defaultplugins: ['plugin'] }))
    user = await User.add({ email: 'email', password: 'password' })
    expect(mockEmailSubscribe).toHaveBeenCalledTimes(2)
    expect(user).toEqual({ id: 'id' })

    // Already exists
    mockAdd.mockImplementation(() => ({ id: 'id', alreadyExists: true }))
    user = await User.add({ email: 'email', password: 'password' })
    expect(mockEmailSubscribe).toHaveBeenCalledTimes(2)
    expect(user).toEqual({ id: 'id', alreadyExists: true })
  })

  test('get', async () => {
    mockGet.mockImplementation(() => ({
      id: 'id',
      email: 'email'
    }))
    let user = await User.get('id', [
      'email',
      'organizations',
      'projects',
      'workspaces',
      'authorizedplugins',
      'plugins'
    ])
    expect(user).toEqual({
      id: 'id',
      email: 'email',
      organizations: [],
      projects: [],
      workspaces: [],
      authorizedplugins: [],
      plugins: []
    })

    mockGet.mockImplementation(() => ({
      id: 'id',
      email: 'email',
      organizations: [],
      projects: [],
      workspaces: [],
      authorizedplugins: [],
      plugins: [
        { configuration: { key: { secret: true } } },
        { configuration: { key: { secret: true, value: 'not a json' } } },
        {
          configuration: { key: { secret: true, value: '{ "json": "test" }' } }
        }
      ]
    }))
    user = await User.get('id', [
      'email',
      'organizations',
      'projects',
      'workspaces',
      'authorizedplugins',
      'plugins'
    ])
    expect(user).toEqual({
      id: 'id',
      email: 'email',
      organizations: [],
      projects: [],
      workspaces: [],
      authorizedplugins: [],
      plugins: [
        { configuration: { key: { secret: true } } },
        { configuration: { key: { secret: true, value: 'not a json' } } },
        {
          configuration: { key: { secret: true, value: { json: 'test' } } }
        }
      ]
    })

    // undefined
    mockGet.mockImplementation(() => undefined)
    await User.get('id', ['email'])
  })

  test('getWithData', async () => {
    let user: any

    // Normal
    mockGet.mockImplementation(() => ({
      id: 'id',
      email: 'email'
    }))
    user = await User.getWithData('id', [])
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(user).toEqual({
      id: 'id',
      email: 'email',
      projects: [],
      workspaces: [],
      usermodels: []
    })

    // With avatar, workspaces, projects & usermodels
    mockGet.mockImplementation(() => ({
      id: 'id',
      email: 'email',
      avatar: 'avatar',
      projects: ['id1', 'id2'],
      workspaces: ['id1', 'id2'],
      usermodels: ['id1', 'id2']
    }))
    mockAvatarRead.mockImplementation(() => 'avatar')
    mockWorkspaceGet
      .mockImplementationOnce(() => undefined)
      .mockImplementationOnce(() => ({}))
    mockProjectGet
      .mockImplementationOnce(() => undefined)
      .mockImplementationOnce(() => ({}))
    mockUserModelGet
      .mockImplementationOnce(() => undefined)
      .mockImplementationOnce(() => ({}))
    user = await User.getWithData('id', ['email', 'avatar'])
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockAvatarRead).toHaveBeenCalledTimes(1)
    expect(user).toEqual({
      id: 'id',
      email: 'email',
      avatar: 'avatar',
      projects: [{}],
      workspaces: [{}],
      usermodels: [{}]
    })

    // Avatar error
    mockAvatarRead.mockImplementation(() => {
      throw new Error('avatar read error')
    })
    await User.getWithData('id', ['email', 'avatar'])

    // Undefined
    mockGet.mockImplementation(() => undefined)
    await User.getWithData('id', [])
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
    // Minimal
    mockGetAll.mockImplementation(() => [{ id: 'id' }])
    const users1 = await User.getAll(['id'])
    expect(mockGetAll).toHaveBeenCalledTimes(1)
    expect(users1).toEqual([{ id: 'id' }])

    // Array data
    const users2 = await User.getAll([
      'id',
      'organizations',
      'workspaces',
      'authorizedplugins',
      'plugins',
      'usermodels'
    ])
    expect(mockGetAll).toHaveBeenCalledTimes(2)
    expect(users2).toEqual([
      {
        id: 'id',
        organizations: [],
        workspaces: [],
        authorizedplugins: [],
        plugins: [],
        usermodels: []
      }
    ])

    // With values
    mockGetAll.mockImplementation(() => [
      {
        id: 'id',
        organizations: [],
        workspaces: [],
        authorizedplugins: [],
        plugins: [],
        usermodels: []
      }
    ])
    const users3 = await User.getAll([
      'id',
      'organizations',
      'workspaces',
      'authorizedplugins',
      'plugins',
      'usermodels'
    ])
    expect(mockGetAll).toHaveBeenCalledTimes(3)
    expect(users3).toEqual([
      {
        id: 'id',
        organizations: [],
        workspaces: [],
        authorizedplugins: [],
        plugins: [],
        usermodels: []
      }
    ])
  })

  test('login', async () => {
    let user

    // Empty
    user = await User.login({ email: 'email', password: 'password' })
    expect(mockGetByUsernameAndPassword).toHaveBeenCalledTimes(1)
    expect(user).toBe(null)

    // Logged
    mockGetByUsernameAndPassword.mockImplementation(() => ({
      id: 'id',
      email: 'email'
    }))
    user = await User.login({ email: 'email', password: 'password' })
    expect(mockGetByUsernameAndPassword).toHaveBeenCalledTimes(2)
    expect(user).toEqual({ id: 'id', email: 'email' })
  })

  test('update', async () => {
    await User.update({ id: 'id' }, [{ key: 'key', value: 'value' }])
    expect(mockUpdate).toHaveBeenCalledTimes(1)

    // With email, with emailer
    mockEmailRevalidate.mockImplementation(() => true)
    await User.update({ id: 'id' }, [{ key: 'email', value: 'email' }])
    expect(mockUpdate).toHaveBeenCalledTimes(2)
    expect(mockEmailRevalidate).toHaveBeenCalledTimes(1)

    // With email, without emailer
    mockEmailRevalidate.mockImplementation(() => false)
    await User.update({ id: 'id' }, [{ key: 'email', value: 'email' }])
    expect(mockUpdate).toHaveBeenCalledTimes(3)
    expect(mockEmailRevalidate).toHaveBeenCalledTimes(2)
  })

  test('del', async () => {
    // Without workspaces & groups
    mockGet.mockImplementation(() => ({}))
    await User.del({ id: 'id' })
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockDel).toHaveBeenCalledTimes(1)

    // With workspaces, organizations & avatar
    mockOrganizationGet.mockImplementation(() => ({
      groups: [{}]
    }))
    mockGet.mockImplementation(() => ({
      organizations: ['id'],
      workspaces: ['id'],
      usermodels: ['id'],
      avatar: 'id'
    }))
    await User.del({ id: 'id' })
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockDel).toHaveBeenCalledTimes(2)
    expect(mockAvatarDel).toHaveBeenCalledTimes(1)
    expect(mockWorkspaceDel).toHaveBeenCalledTimes(1)
    expect(mockOrganizationUpdate).toHaveBeenCalledTimes(4)
    expect(mockGroupUpdate).toHaveBeenCalledTimes(1)

    // No organization
    mockOrganizationGet.mockImplementation(() => undefined)
    await User.del({ id: 'id' })

    // Undefined
    mockGet.mockImplementation(() => undefined)
    await User.del({ id: 'id' })
  })
})
