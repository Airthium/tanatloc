import Avatar from '../'

const mockPath = jest.fn()
jest.mock('path', () => ({
  join: () => mockPath()
}))

const mockSharp = jest.fn()
jest.mock('sharp', () => () => mockSharp())

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

const mockUserGet = jest.fn()
const mockUserUpdate = jest.fn()
jest.mock('../../user', () => ({
  get: async () => mockUserGet(),
  update: async () => mockUserUpdate()
}))

const mockProjectGet = jest.fn()
const mockProjectUpdate = jest.fn()
jest.mock('../../project', () => ({
  get: async () => mockProjectGet(),
  update: async () => mockProjectUpdate()
}))

const mockToolsCopyFile = jest.fn()
const mockToolsReadFile = jest.fn()
const mockToolsWriteFile = jest.fn()
const mockToolsRemoveFile = jest.fn()
jest.mock('../../tools', () => ({
  copyFile: async () => mockToolsCopyFile(),
  readFile: async () => mockToolsReadFile(),
  writeFile: async () => mockToolsWriteFile(),
  removeFile: async () => mockToolsRemoveFile()
}))

describe('lib/avatar', () => {
  beforeEach(() => {
    mockPath.mockReset()

    mockSharp.mockReset()
    mockSharp.mockImplementation(() => ({
      resize: () => ({
        toBuffer: jest.fn
      })
    }))

    mockAdd.mockReset()
    mockAdd.mockImplementation(() => ({
      id: 'id'
    }))
    mockGet.mockReset()
    mockGet.mockImplementation(() => ({
      path: 'path'
    }))
    mockDel.mockReset()

    mockUserGet.mockReset()
    mockUserGet.mockImplementation(() => ({}))
    mockUserUpdate.mockReset()

    mockProjectGet.mockReset()
    mockProjectGet.mockImplementation(() => ({}))
    mockProjectUpdate.mockReset()

    mockToolsCopyFile.mockReset()
    mockToolsReadFile.mockReset()
    mockToolsReadFile.mockImplementation(() => 'avatar')
    mockToolsWriteFile.mockReset()
    mockToolsRemoveFile.mockReset()
  })

  test('add', async () => {
    let avatar

    avatar = await Avatar.add({ id: 'id' }, 'user', {
      name: 'name',
      uid: 'uid',
      data: 'data'
    })
    expect(mockPath).toHaveBeenCalledTimes(0)
    expect(mockSharp).toHaveBeenCalledTimes(1)
    expect(mockAdd).toHaveBeenCalledTimes(1)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockUserGet).toHaveBeenCalledTimes(1)
    expect(mockUserUpdate).toHaveBeenCalledTimes(1)
    expect(mockProjectGet).toHaveBeenCalledTimes(0)
    expect(mockProjectUpdate).toHaveBeenCalledTimes(0)
    expect(mockToolsReadFile).toHaveBeenCalledTimes(0)
    expect(mockToolsWriteFile).toHaveBeenCalledTimes(1)
    expect(mockToolsRemoveFile).toHaveBeenCalledTimes(0)
    expect(avatar).toEqual({ id: 'id' })

    // With user avatar
    mockUserGet.mockImplementation(() => ({
      avatar: 'avatar'
    }))
    avatar = await Avatar.add({ id: 'id' }, 'user', {
      name: 'name',
      uid: 'uid',
      data: 'data'
    })
    expect(mockPath).toHaveBeenCalledTimes(1)
    expect(mockSharp).toHaveBeenCalledTimes(2)
    expect(mockAdd).toHaveBeenCalledTimes(2)
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockDel).toHaveBeenCalledTimes(1)
    expect(mockUserGet).toHaveBeenCalledTimes(2)
    expect(mockUserUpdate).toHaveBeenCalledTimes(3)
    expect(mockProjectGet).toHaveBeenCalledTimes(0)
    expect(mockProjectUpdate).toHaveBeenCalledTimes(0)
    expect(mockToolsReadFile).toHaveBeenCalledTimes(0)
    expect(mockToolsWriteFile).toHaveBeenCalledTimes(2)
    expect(mockToolsRemoveFile).toHaveBeenCalledTimes(1)
    expect(avatar).toEqual({ id: 'id' })

    // Project
    avatar = await Avatar.add({ id: 'id' }, 'project', {
      name: 'name',
      uid: 'uid',
      data: 'data'
    })
    expect(mockPath).toHaveBeenCalledTimes(1)
    expect(mockSharp).toHaveBeenCalledTimes(2)
    expect(mockAdd).toHaveBeenCalledTimes(3)
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockDel).toHaveBeenCalledTimes(1)
    expect(mockUserGet).toHaveBeenCalledTimes(2)
    expect(mockUserUpdate).toHaveBeenCalledTimes(3)
    expect(mockProjectGet).toHaveBeenCalledTimes(1)
    expect(mockProjectUpdate).toHaveBeenCalledTimes(1)
    expect(mockToolsReadFile).toHaveBeenCalledTimes(0)
    expect(mockToolsWriteFile).toHaveBeenCalledTimes(3)
    expect(mockToolsRemoveFile).toHaveBeenCalledTimes(1)
    expect(avatar).toEqual({ id: 'id' })

    // With project avatar
    mockProjectGet.mockImplementation(() => ({
      avatar: 'avatar'
    }))
    avatar = await Avatar.add({ id: 'id' }, 'project', {
      name: 'name',
      uid: 'uid',
      data: 'data'
    })
    expect(mockPath).toHaveBeenCalledTimes(2)
    expect(mockSharp).toHaveBeenCalledTimes(2)
    expect(mockAdd).toHaveBeenCalledTimes(4)
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockDel).toHaveBeenCalledTimes(2)
    expect(mockUserGet).toHaveBeenCalledTimes(2)
    expect(mockUserUpdate).toHaveBeenCalledTimes(3)
    expect(mockProjectGet).toHaveBeenCalledTimes(2)
    expect(mockProjectUpdate).toHaveBeenCalledTimes(3)
    expect(mockToolsReadFile).toHaveBeenCalledTimes(0)
    expect(mockToolsWriteFile).toHaveBeenCalledTimes(4)
    expect(mockToolsRemoveFile).toHaveBeenCalledTimes(2)
    expect(avatar).toEqual({ id: 'id' })
  })

  test('read', async () => {
    mockGet.mockImplementation(() => ({
      path: 'path',
      type: 'type'
    }))
    const avatar = await Avatar.read('id')
    expect(mockPath).toHaveBeenCalledTimes(1)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockUserGet).toHaveBeenCalledTimes(0)
    expect(mockUserUpdate).toHaveBeenCalledTimes(0)
    expect(mockProjectGet).toHaveBeenCalledTimes(0)
    expect(mockProjectUpdate).toHaveBeenCalledTimes(0)
    expect(mockToolsReadFile).toHaveBeenCalledTimes(1)
    expect(avatar).toEqual(Buffer.from('typeavatar'))

    // Without avatar
    mockGet.mockImplementation(() => {
      // empty mock
    })
    try {
      await Avatar.read('id')
      expect(true).toBe(false)
    } catch (err) {
      expect(err.message).toBe('Avatar does not exist.')
    }
    expect(mockPath).toHaveBeenCalledTimes(1)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockUserGet).toHaveBeenCalledTimes(0)
    expect(mockUserUpdate).toHaveBeenCalledTimes(0)
    expect(mockProjectGet).toHaveBeenCalledTimes(0)
    expect(mockProjectUpdate).toHaveBeenCalledTimes(0)
    expect(mockToolsReadFile).toHaveBeenCalledTimes(1)
  })

  test('get', async () => {
    const avatar = await Avatar.get('id', ['data'])
    expect(mockPath).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(avatar).toEqual({
      path: 'path'
    })
  })

  test('del', async () => {
    // With path
    await Avatar.del({ id: 'id' }, 'user', 'id')
    expect(mockPath).toHaveBeenCalledTimes(1)
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockDel).toHaveBeenCalledTimes(1)
    expect(mockUserUpdate).toHaveBeenCalledTimes(1)
    expect(mockProjectUpdate).toHaveBeenCalledTimes(0)
    expect(mockToolsRemoveFile).toHaveBeenCalledTimes(1)

    // removeFile error & project
    mockToolsRemoveFile.mockImplementation(() => {
      throw new Error()
    })
    await Avatar.del({ id: 'id' }, 'project', 'id')
    expect(mockPath).toHaveBeenCalledTimes(2)
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockDel).toHaveBeenCalledTimes(2)
    expect(mockUserUpdate).toHaveBeenCalledTimes(1)
    expect(mockProjectUpdate).toHaveBeenCalledTimes(1)
    expect(mockToolsRemoveFile).toHaveBeenCalledTimes(2)

    // Without path
    mockGet.mockImplementation(() => ({}))
    await Avatar.del({ id: 'id' }, 'user', 'id')
    expect(mockPath).toHaveBeenCalledTimes(2)
    expect(mockGet).toHaveBeenCalledTimes(3)
    expect(mockDel).toHaveBeenCalledTimes(3)
    expect(mockUserUpdate).toHaveBeenCalledTimes(2)
    expect(mockProjectUpdate).toHaveBeenCalledTimes(1)
    expect(mockToolsRemoveFile).toHaveBeenCalledTimes(2)
  })

  test('archive', async () => {
    // Empty
    mockGet.mockImplementationOnce(() => ({}))
    await Avatar.archive({ id: 'id' }, 'to')
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockToolsCopyFile).toHaveBeenCalledTimes(0)
    expect(mockToolsRemoveFile).toHaveBeenCalledTimes(0)

    // With path
    mockGet.mockImplementationOnce(() => ({ path: 'path' }))
    await Avatar.archive({ id: 'id' }, 'to')
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockToolsCopyFile).toHaveBeenCalledTimes(1)
    expect(mockToolsRemoveFile).toHaveBeenCalledTimes(1)
  })
})
