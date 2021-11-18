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

const mockGetProject = jest.fn()
const mockUpdateProject = jest.fn()
jest.mock('../../project', () => ({
  get: async () => mockGetProject(),
  update: async () => mockUpdateProject()
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

    mockGetProject.mockReset()
    mockGetProject.mockImplementation(() => ({}))
    mockUpdateProject.mockReset()

    mockReadFile.mockReset()
    mockReadFile.mockImplementation(() => 'avatar')
    mockWriteFile.mockReset()
    mockRemoveFile.mockReset()
  })

  test('add', async () => {
    let avatar

    avatar = await Avatar.add({ id: 'id' }, 'user', {
      name: 'name',
      uid: 'uid',
      data: Buffer.from('data')
    })
    expect(mockPath).toHaveBeenCalledTimes(0)
    expect(mockAdd).toHaveBeenCalledTimes(1)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockGetUser).toHaveBeenCalledTimes(1)
    expect(mockUpdateUser).toHaveBeenCalledTimes(1)
    expect(mockGetProject).toHaveBeenCalledTimes(0)
    expect(mockUpdateProject).toHaveBeenCalledTimes(0)
    expect(mockReadFile).toHaveBeenCalledTimes(0)
    expect(mockWriteFile).toHaveBeenCalledTimes(1)
    expect(mockRemoveFile).toHaveBeenCalledTimes(0)
    expect(avatar).toEqual({ id: 'id' })

    // With user avatar
    mockGetUser.mockImplementation(() => ({
      avatar: 'avatar'
    }))
    avatar = await Avatar.add({ id: 'id' }, 'user', {
      name: 'name',
      uid: 'uid',
      data: Buffer.from('data')
    })
    expect(mockPath).toHaveBeenCalledTimes(1)
    expect(mockAdd).toHaveBeenCalledTimes(2)
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockDel).toHaveBeenCalledTimes(1)
    expect(mockGetUser).toHaveBeenCalledTimes(2)
    expect(mockUpdateUser).toHaveBeenCalledTimes(3)
    expect(mockGetProject).toHaveBeenCalledTimes(0)
    expect(mockUpdateProject).toHaveBeenCalledTimes(0)
    expect(mockReadFile).toHaveBeenCalledTimes(0)
    expect(mockWriteFile).toHaveBeenCalledTimes(2)
    expect(mockRemoveFile).toHaveBeenCalledTimes(1)
    expect(avatar).toEqual({ id: 'id' })

    // Project
    avatar = await Avatar.add({ id: 'id' }, 'project', {
      name: 'name',
      uid: 'uid',
      data: Buffer.from('data')
    })
    expect(mockPath).toHaveBeenCalledTimes(1)
    expect(mockAdd).toHaveBeenCalledTimes(3)
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockDel).toHaveBeenCalledTimes(1)
    expect(mockGetUser).toHaveBeenCalledTimes(2)
    expect(mockUpdateUser).toHaveBeenCalledTimes(3)
    expect(mockGetProject).toHaveBeenCalledTimes(1)
    expect(mockUpdateProject).toHaveBeenCalledTimes(1)
    expect(mockReadFile).toHaveBeenCalledTimes(0)
    expect(mockWriteFile).toHaveBeenCalledTimes(3)
    expect(mockRemoveFile).toHaveBeenCalledTimes(1)
    expect(avatar).toEqual({ id: 'id' })

    // With project avatar
    mockGetProject.mockImplementation(() => ({
      avatar: 'avatar'
    }))
    avatar = await Avatar.add({ id: 'id' }, 'project', {
      name: 'name',
      uid: 'uid',
      data: Buffer.from('data')
    })
    expect(mockPath).toHaveBeenCalledTimes(2)
    expect(mockAdd).toHaveBeenCalledTimes(4)
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockDel).toHaveBeenCalledTimes(2)
    expect(mockGetUser).toHaveBeenCalledTimes(2)
    expect(mockUpdateUser).toHaveBeenCalledTimes(3)
    expect(mockGetProject).toHaveBeenCalledTimes(2)
    expect(mockUpdateProject).toHaveBeenCalledTimes(3)
    expect(mockReadFile).toHaveBeenCalledTimes(0)
    expect(mockWriteFile).toHaveBeenCalledTimes(4)
    expect(mockRemoveFile).toHaveBeenCalledTimes(2)
    expect(avatar).toEqual({ id: 'id' })
  })

  test('read', async () => {
    const avatar = await Avatar.read('id')
    expect(mockPath).toHaveBeenCalledTimes(1)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockGetUser).toHaveBeenCalledTimes(0)
    expect(mockUpdateUser).toHaveBeenCalledTimes(0)
    expect(mockGetProject).toHaveBeenCalledTimes(0)
    expect(mockUpdateProject).toHaveBeenCalledTimes(0)
    expect(mockReadFile).toHaveBeenCalledTimes(1)
    expect(mockWriteFile).toHaveBeenCalledTimes(0)
    expect(mockRemoveFile).toHaveBeenCalledTimes(0)
    expect(avatar).toBe('avatar')

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
    expect(mockGetUser).toHaveBeenCalledTimes(0)
    expect(mockUpdateUser).toHaveBeenCalledTimes(0)
    expect(mockGetProject).toHaveBeenCalledTimes(0)
    expect(mockUpdateProject).toHaveBeenCalledTimes(0)
    expect(mockReadFile).toHaveBeenCalledTimes(1)
    expect(mockWriteFile).toHaveBeenCalledTimes(0)
    expect(mockRemoveFile).toHaveBeenCalledTimes(0)
  })

  test('get', async () => {
    const avatar = await Avatar.get('id', ['data'])
    expect(mockPath).toHaveBeenCalledTimes(0)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockDel).toHaveBeenCalledTimes(0)
    expect(mockGetUser).toHaveBeenCalledTimes(0)
    expect(mockUpdateUser).toHaveBeenCalledTimes(0)
    expect(mockGetProject).toHaveBeenCalledTimes(0)
    expect(mockUpdateProject).toHaveBeenCalledTimes(0)
    expect(mockReadFile).toHaveBeenCalledTimes(0)
    expect(mockWriteFile).toHaveBeenCalledTimes(0)
    expect(mockRemoveFile).toHaveBeenCalledTimes(0)
    expect(avatar).toEqual({
      path: 'path'
    })
  })

  test('del', async () => {
    // With path
    await Avatar.del({ id: 'id' }, 'user', 'id')
    expect(mockPath).toHaveBeenCalledTimes(1)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockDel).toHaveBeenCalledTimes(1)
    expect(mockGetUser).toHaveBeenCalledTimes(0)
    expect(mockUpdateUser).toHaveBeenCalledTimes(1)
    expect(mockGetProject).toHaveBeenCalledTimes(0)
    expect(mockUpdateProject).toHaveBeenCalledTimes(0)
    expect(mockReadFile).toHaveBeenCalledTimes(0)
    expect(mockWriteFile).toHaveBeenCalledTimes(0)
    expect(mockRemoveFile).toHaveBeenCalledTimes(1)

    // removeFile error & project
    mockRemoveFile.mockImplementation(() => {
      throw new Error()
    })
    await Avatar.del({ id: 'id' }, 'project', 'id')
    expect(mockPath).toHaveBeenCalledTimes(2)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockDel).toHaveBeenCalledTimes(2)
    expect(mockGetUser).toHaveBeenCalledTimes(0)
    expect(mockUpdateUser).toHaveBeenCalledTimes(1)
    expect(mockGetProject).toHaveBeenCalledTimes(0)
    expect(mockUpdateProject).toHaveBeenCalledTimes(1)
    expect(mockReadFile).toHaveBeenCalledTimes(0)
    expect(mockWriteFile).toHaveBeenCalledTimes(0)
    expect(mockRemoveFile).toHaveBeenCalledTimes(2)

    // Without path
    mockGet.mockImplementation(() => ({}))
    await Avatar.del({ id: 'id' }, 'user', 'id')
    expect(mockPath).toHaveBeenCalledTimes(2)
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(3)
    expect(mockDel).toHaveBeenCalledTimes(3)
    expect(mockGetUser).toHaveBeenCalledTimes(0)
    expect(mockUpdateUser).toHaveBeenCalledTimes(2)
    expect(mockGetProject).toHaveBeenCalledTimes(0)
    expect(mockUpdateProject).toHaveBeenCalledTimes(1)
    expect(mockReadFile).toHaveBeenCalledTimes(0)
    expect(mockWriteFile).toHaveBeenCalledTimes(0)
    expect(mockRemoveFile).toHaveBeenCalledTimes(2)
  })
})
