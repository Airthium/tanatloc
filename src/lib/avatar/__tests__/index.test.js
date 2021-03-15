import Avatar from '../'

const mockPath = jest.fn()
jest.mock('path', () => ({
  join: () => mockPath()
}))

jest.mock('@/config/storage', () => ({
  AVATAR: 'avatar'
}))

const mockAdd = jest.fn()
const mockGet = jest.fn()
const mockDel = jest.fn()
jest.mock('@/database/avatar', () => ({
  add: async () => mockAdd(),
  get: async () => mockGet(),
  del: async () => mockDel()
}))

const mockGetUser = jest.fn()
const mockUpdateUser = jest.fn()
jest.mock('../../user', () => ({
  get: async () => mockGetUser(),
  update: async () => mockUpdateUser()
}))

const mockReadFile = jest.fn()
const mockWriteFile = jest.fn()
const mockRemoveFile = jest.fn()
jest.mock('../../tools', () => ({
  readFile: async () => mockReadFile(),
  writeFile: async () => mockWriteFile(),
  removeFile: async () => mockRemoveFile()
}))

describe('lib/avatar', () => {
  beforeEach(() => {
    mockPath.mockReset()

    mockAdd.mockReset()
    mockAdd.mockImplementation(() => ({
      id: 'id'
    }))
    mockGet.mockReset()
    mockGet.mockImplementation(() => ({
      path: 'path'
    }))
    mockDel.mockReset()

    mockGetUser.mockReset()
    mockGetUser.mockImplementation(() => ({}))
    mockUpdateUser.mockReset()

    mockReadFile.mockReset()
    mockReadFile.mockImplementation(() => 'avatar')
    mockWriteFile.mockReset()
    mockRemoveFile.mockReset()
  })

  it('add', async () => {
    let avatar

    avatar = await Avatar.add(
      { id: 'id' },
      { name: 'name', uid: 'uid', data: 'data' }
    )
    expect(mockPath).toHaveBeenCalledTimes(0)
    expect(mockAdd).toHaveBeenCalledTimes(1)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockGetUser).toHaveBeenCalledTimes(1)
    expect(mockUpdateUser).toHaveBeenCalledTimes(1)
    expect(mockReadFile).toHaveBeenCalledTimes(0)
    expect(mockWriteFile).toHaveBeenCalledTimes(1)
    expect(mockRemoveFile).toHaveBeenCalledTimes(0)
    expect(avatar).toEqual({ id: 'id' })

    // With user avatar
    mockGetUser.mockImplementation(() => ({
      avatar: 'avatar'
    }))
    avatar = await Avatar.add(
      { id: 'id' },
      { name: 'name', uid: 'uid', data: 'data' }
    )
    expect(mockPath).toHaveBeenCalledTimes(1)
    expect(mockAdd).toHaveBeenCalledTimes(2)
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockDel).toHaveBeenCalledTimes(1)
    expect(mockGetUser).toHaveBeenCalledTimes(2)
    expect(mockUpdateUser).toHaveBeenCalledTimes(3)
    expect(mockReadFile).toHaveBeenCalledTimes(0)
    expect(mockWriteFile).toHaveBeenCalledTimes(2)
    expect(mockRemoveFile).toHaveBeenCalledTimes(1)
    expect(avatar).toEqual({ id: 'id' })
  })

  it('read', async () => {
    const avatar = await Avatar.read('id')
    expect(mockPath).toHaveBeenCalledTimes(1)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockGetUser).toHaveBeenCalledTimes(0)
    expect(mockUpdateUser).toHaveBeenCalledTimes(0)
    expect(mockReadFile).toHaveBeenCalledTimes(1)
    expect(mockWriteFile).toHaveBeenCalledTimes(0)
    expect(mockRemoveFile).toHaveBeenCalledTimes(0)
    expect(avatar).toBe('avatar')
  })

  it('get', async () => {
    const avatar = await Avatar.get('id', ['data'])
    expect(mockPath).toHaveBeenCalledTimes(0)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockGetUser).toHaveBeenCalledTimes(0)
    expect(mockUpdateUser).toHaveBeenCalledTimes(0)
    expect(mockReadFile).toHaveBeenCalledTimes(0)
    expect(mockWriteFile).toHaveBeenCalledTimes(0)
    expect(mockRemoveFile).toHaveBeenCalledTimes(0)
    expect(avatar).toEqual({
      path: 'path'
    })
  })

  it('del', async () => {
    // With path
    await Avatar.del({ id: 'id' }, 'id')
    expect(mockPath).toHaveBeenCalledTimes(1)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockDel).toHaveBeenCalledTimes(1)
    expect(mockGetUser).toHaveBeenCalledTimes(0)
    expect(mockUpdateUser).toHaveBeenCalledTimes(1)
    expect(mockReadFile).toHaveBeenCalledTimes(0)
    expect(mockWriteFile).toHaveBeenCalledTimes(0)
    expect(mockRemoveFile).toHaveBeenCalledTimes(1)

    // Without path
    mockGet.mockImplementation(() => ({}))
    await Avatar.del({ id: 'id' }, 'id')
    expect(mockPath).toHaveBeenCalledTimes(1)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockDel).toHaveBeenCalledTimes(2)
    expect(mockGetUser).toHaveBeenCalledTimes(0)
    expect(mockUpdateUser).toHaveBeenCalledTimes(2)
    expect(mockReadFile).toHaveBeenCalledTimes(0)
    expect(mockWriteFile).toHaveBeenCalledTimes(0)
    expect(mockRemoveFile).toHaveBeenCalledTimes(1)
  })
})
