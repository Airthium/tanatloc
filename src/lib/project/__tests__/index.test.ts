import Project from '../'

jest.mock('@/config/storage', () => ({
  STORAGE: 'storage',
  AVATAR_RELATIVE: 'avatar',
  GEOMETRY: 'geometries',
  GEOMETRY_RELATIVE: 'geometries',
  SIMULATION_RELATIVE: 'simulations'
}))

const mockAdd = jest.fn()
const mockGet = jest.fn()
const mockUpdate = jest.fn()
const mockDelete = jest.fn()
jest.mock('@/database/project', () => ({
  add: async () => mockAdd(),
  get: async () => mockGet(),
  update: async () => mockUpdate(),
  del: async () => mockDelete()
}))

const mockAvatarRead = jest.fn()
const mockAvatarArchive = jest.fn()
jest.mock('../../avatar', () => ({
  read: async (val: any) => mockAvatarRead(val),
  archive: async () => mockAvatarArchive()
}))

const mockUserGet = jest.fn()
const mockUserGetWithData = jest.fn()
const mockUserUpdate = jest.fn()
jest.mock('../../user', () => ({
  get: async (val: any) => mockUserGet(val),
  getWithData: async () => mockUserGetWithData(),
  update: async () => mockUserUpdate()
}))

const mockGroupGet = jest.fn()
const mockGroupGetWithData = jest.fn()
const mockGroupUpdate = jest.fn()
jest.mock('../../group', () => ({
  get: async () => mockGroupGet(),
  getWithData: async () => mockGroupGetWithData(),
  update: async () => mockGroupUpdate()
}))

const mockWorkspaceUpdate = jest.fn()
jest.mock('../../workspace', () => ({
  update: async () => mockWorkspaceUpdate()
}))

const mockGeometryAdd = jest.fn()
const mockGeometryGet = jest.fn()
const mockGeometryUpdate = jest.fn()
const mockGeometryArchive = jest.fn()
jest.mock('../../geometry', () => ({
  add: async () => mockGeometryAdd(),
  get: async () => mockGeometryGet(),
  update: async () => mockGeometryUpdate(),
  archive: async () => mockGeometryArchive()
}))

const mockSimulationAdd = jest.fn()
const mockSimulationGet = jest.fn()
const mockSimulationDel = jest.fn()
const mockSimulationArchive = jest.fn()
jest.mock('../../simulation', () => ({
  add: async () => mockSimulationAdd(),
  get: async () => mockSimulationGet(),
  del: async () => mockSimulationDel(),
  archive: async () => mockSimulationArchive()
}))

const mockToolsCreatePath = jest.fn()
const mockToolsReadFile = jest.fn()
const mockToolsWriteFile = jest.fn()
const mockToolsArchive = jest.fn()
const mockToolsReadStream = jest.fn()
const mockToolsRemoveDirectory = jest.fn()
const mockToolsUnarchive = jest.fn()
const mockToolsListDirectories = jest.fn()
const mockToolsRemoveFile = jest.fn()
const mockToolsListFiles = jest.fn()
const mockToolsCopyFile = jest.fn()
const mockToolsCopyDirectory = jest.fn()
jest.mock('../../tools', () => ({
  createPath: async () => mockToolsCreatePath(),
  readFile: async () => mockToolsReadFile(),
  writeFile: async () => mockToolsWriteFile(),
  archive: () => mockToolsArchive(),
  readStream: async () => mockToolsReadStream(),
  removeDirectory: async () => mockToolsRemoveDirectory(),
  unarchive: async () => mockToolsUnarchive(),
  listDirectories: async () => mockToolsListDirectories(),
  removeFile: async () => mockToolsRemoveFile(),
  listFiles: async () => mockToolsListFiles(),
  copyFile: async () => mockToolsCopyFile(),
  copyDirectory: async () => mockToolsCopyDirectory()
}))

describe('lib/project', () => {
  beforeEach(() => {
    mockAdd.mockReset()
    mockGet.mockReset()
    mockUpdate.mockReset()
    mockDelete.mockReset()

    mockAvatarRead.mockReset()
    mockAvatarArchive.mockReset()

    mockUserGet.mockReset()
    mockUserGetWithData.mockReset()
    mockUpdate.mockReset()

    mockGroupGet.mockReset()
    mockGroupGetWithData.mockReset()
    mockGroupUpdate.mockReset()

    mockWorkspaceUpdate.mockReset()

    mockGeometryAdd.mockReset()
    mockGeometryGet.mockReset()
    mockGeometryUpdate.mockReset()
    mockGeometryArchive.mockReset()

    mockSimulationAdd.mockReset()
    mockSimulationGet.mockReset()
    mockSimulationDel.mockReset()
    mockSimulationArchive.mockReset()

    mockToolsCreatePath.mockReset()
    mockToolsReadFile.mockReset()
    mockToolsWriteFile.mockReset()
    mockToolsArchive.mockReset()
    mockToolsReadStream.mockReset()
    mockToolsRemoveDirectory.mockReset()
    mockToolsUnarchive.mockReset()
    mockToolsListDirectories.mockReset()
    mockToolsRemoveFile.mockReset()
    mockToolsListFiles.mockReset()
    mockToolsCopyFile.mockReset()
    mockToolsCopyDirectory.mockReset()
  })

  test('add', async () => {
    mockAdd.mockImplementation(() => ({ id: 'id' }))
    const project = await Project.add(
      { id: 'id' },
      { id: 'id' },
      { title: 'title', description: 'description' }
    )
    expect(mockAdd).toHaveBeenCalledTimes(1)
    expect(mockWorkspaceUpdate).toHaveBeenCalledTimes(1)
    expect(project).toEqual({ id: 'id' })
  })

  test('get', async () => {
    mockGet.mockImplementation(() => ({ id: 'id' }))
    let project = await Project.get('id', [
      'geometries',
      'simulations',
      'owners',
      'users',
      'groups'
    ])
    expect(project).toEqual({
      id: 'id',
      geometries: [],
      simulations: [],
      owners: [],
      users: [],
      groups: []
    })

    mockGet.mockImplementation(() => ({
      id: 'id',
      geometries: [],
      simulations: [],
      owners: [],
      users: [],
      groups: []
    }))
    project = await Project.get('id', [
      'geometries',
      'simulations',
      'owners',
      'users',
      'groups'
    ])
    expect(project).toEqual({
      id: 'id',
      geometries: [],
      simulations: [],
      owners: [],
      users: [],
      groups: []
    })
  })

  test('getWithData', async () => {
    let project

    // Empty
    mockGet.mockImplementation(() => ({}))
    project = await Project.getWithData('id', ['title'])
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(project).toEqual({})

    // With avatar, owners, users & groups
    mockGet.mockImplementation(() => ({
      avatar: 'avatar',
      owners: ['owner'],
      users: ['user'],
      groups: ['group']
    }))
    mockUserGetWithData.mockImplementation(() => ({ id: 'user' }))
    mockGroupGetWithData.mockImplementation(() => ({ id: 'group' }))
    mockAvatarRead.mockImplementation((val) => val)
    project = await Project.getWithData('id', ['title'])
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockAvatarRead).toHaveBeenCalledTimes(1)
    expect(mockUserGetWithData).toHaveBeenCalledTimes(2)
    expect(project).toEqual({
      avatar: 'avatar',
      owners: [{ id: 'user' }],
      users: [{ id: 'user' }],
      groups: [{ id: 'group' }]
    })

    // With avatar error
    mockAvatarRead.mockImplementation(() => {
      throw new Error()
    })
    project = await Project.getWithData('id', ['title'])
    expect(mockGet).toHaveBeenCalledTimes(3)
    expect(mockAvatarRead).toHaveBeenCalledTimes(2)
    expect(mockUserGetWithData).toHaveBeenCalledTimes(4)
    expect(mockWorkspaceUpdate).toHaveBeenCalledTimes(0)
    expect(project).toEqual({
      avatar: undefined,
      owners: [{ id: 'user' }],
      users: [{ id: 'user' }],
      groups: [{ id: 'group' }]
    })

    // Archived
    mockGet.mockImplementation(() => ({
      archived: true
    }))
    project = await Project.getWithData('id', ['title'])
    expect(mockGet).toHaveBeenCalledTimes(4)
    expect(project).toEqual({
      archived: true
    })
  })

  test('update', async () => {
    mockGet.mockImplementation(() => ({}))
    mockGroupGet.mockImplementation(() => ({ projects: [] }))
    mockUserGet.mockImplementation(() => ({ projects: [] }))
    await Project.update({ id: 'id' }, [
      { key: 'groups', value: ['id'] },
      { key: 'users', value: ['id'] }
    ])
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockUpdate).toHaveBeenCalledTimes(1)

    // With groups & users
    mockGet.mockImplementation(() => ({
      groups: ['id1'],
      users: ['id1']
    }))

    await Project.update({ id: 'id' }, [
      { key: 'groups', value: ['id'] },
      { key: 'users', value: ['id'] }
    ])
    expect(mockGet).toHaveBeenCalledTimes(4)
    expect(mockUpdate).toHaveBeenCalledTimes(2)

    // No groups update, no users update
    await Project.update({ id: 'id' }, [])
    expect(mockGet).toHaveBeenCalledTimes(4)
    expect(mockUpdate).toHaveBeenCalledTimes(3)

    // Already in group, already in users
    mockGroupGet.mockImplementation(() => ({ projects: ['id'] }))
    mockUserGet.mockImplementation(() => ({ projects: ['id'] }))
    await Project.update({ id: 'id' }, [
      { key: 'groups', value: ['id'] },
      { key: 'users', value: ['id'] }
    ])
    expect(mockGet).toHaveBeenCalledTimes(6)
    expect(mockUpdate).toHaveBeenCalledTimes(4)

    // Update title
    await Project.update({ id: 'id' }, [{ key: 'title', value: 'title' }])

    // Update description
    await Project.update({ id: 'id' }, [
      { key: 'description', value: 'description' }
    ])
  })

  test('delete', async () => {
    // Without simulations & groups
    mockGet.mockImplementation(() => ({}))
    await Project.del({ id: 'id' }, { id: 'id' })
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockDelete).toHaveBeenCalledTimes(1)
    expect(mockWorkspaceUpdate).toHaveBeenCalledTimes(1)

    // With simulations & groups
    mockGet.mockImplementation(() => ({
      groups: ['id'],
      users: ['id'],
      simulations: ['id']
    }))
    await Project.del({ id: 'id' }, { id: 'id' })
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockDelete).toHaveBeenCalledTimes(2)
    expect(mockWorkspaceUpdate).toHaveBeenCalledTimes(2)
    expect(mockSimulationDel).toHaveBeenCalledTimes(1)
  })

  test('archive', async () => {
    // Without avatar, geometries & simulations
    mockGet.mockImplementationOnce(() => ({}))
    await Project.archive({ id: 'id' })
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockToolsCreatePath).toHaveBeenCalledTimes(1)
    expect(mockToolsWriteFile).toHaveBeenCalledTimes(1)
    expect(mockToolsArchive).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(mockToolsReadStream).toHaveBeenCalledTimes(1)

    // With avatar, geometries & simulations
    mockGet.mockImplementationOnce(() => ({
      avatar: 'avatar',
      geometries: ['id'],
      simulations: ['id']
    }))
    await Project.archive({ id: 'id' })
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockToolsCreatePath).toHaveBeenCalledTimes(2)
    expect(mockToolsWriteFile).toHaveBeenCalledTimes(2)
    expect(mockAvatarArchive).toHaveBeenCalledTimes(1)
    expect(mockGeometryArchive).toHaveBeenCalledTimes(1)
    expect(mockSimulationArchive).toHaveBeenCalledTimes(1)
    expect(mockToolsArchive).toHaveBeenCalledTimes(2)
    expect(mockUpdate).toHaveBeenCalledTimes(2)
    expect(mockToolsReadStream).toHaveBeenCalledTimes(2)
  })

  test('unarchiveFromServer', async () => {
    // Minimal
    mockToolsListDirectories.mockImplementation(() => [])
    await Project.unarchiveFromServer({ id: 'id' })
    expect(mockToolsUnarchive).toHaveBeenCalledTimes(1)
    expect(mockToolsListDirectories).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(mockToolsRemoveDirectory).toHaveBeenCalledTimes(1)
    expect(mockToolsRemoveFile).toHaveBeenCalledTimes(1)

    // With avatar, geometries & simulations
    mockToolsListDirectories.mockImplementation(() => [
      'avatar',
      'geometries',
      'simulations'
    ])
    mockToolsListFiles.mockImplementation(() => [
      { isDirectory: () => true, name: 'directory' },
      { isDirectory: () => false, isFile: () => true, name: 'file' },
      { isDirectory: () => false, isFile: () => false, name: 'other' }
    ])
    await Project.unarchiveFromServer({ id: 'id' })
    expect(mockToolsUnarchive).toHaveBeenCalledTimes(2)
    expect(mockToolsListDirectories).toHaveBeenCalledTimes(3)
    expect(mockToolsCopyFile).toHaveBeenCalledTimes(4)
    expect(mockToolsCopyDirectory).toHaveBeenCalledTimes(4)
    expect(mockUpdate).toHaveBeenCalledTimes(2)
    expect(mockToolsRemoveDirectory).toHaveBeenCalledTimes(2)
    expect(mockToolsRemoveFile).toHaveBeenCalledTimes(2)

    // No archive
    mockToolsUnarchive.mockImplementation(() => {
      throw new Error('no archive')
    })
    try {
      await Project.unarchiveFromServer({ id: 'id' })
      expect(true).toBe(false)
    } catch (err: any) {
      expect(err.message).toBe('Archive not found')
    }
    expect(mockToolsUnarchive).toHaveBeenCalledTimes(3)
  })

  test('deleteArchiveFile', async () => {
    // Normal
    await Project.deleteArchiveFile({ id: 'id' })

    // ENOENT
    mockToolsRemoveFile.mockImplementation(() => {
      const err = new Error() as Error & { code: string }
      err.code = 'ENOENT'
      throw err
    })
    await Project.deleteArchiveFile({ id: 'id' })

    // Error
    mockToolsRemoveFile.mockImplementation(() => {
      throw new Error('remove file error')
    })
    try {
      await Project.deleteArchiveFile({ id: 'id' })
      expect(true).toBe(false)
    } catch (err: any) {
      expect(err.message).toBe('remove file error')
    }
  })

  test('unarchiveFromFile', async () => {
    try {
      await Project.unarchiveFromFile({ id: 'id' }, Buffer.from('buffer'))
    } catch (err) {}
    expect(mockToolsWriteFile).toHaveBeenCalledTimes(1)
  })

  test('copy', async () => {
    // Without geometry value/values
    mockGet.mockImplementation(() => ({
      geometries: ['id1', 'id2'],
      simulations: ['id1', 'id2']
    }))
    mockAdd.mockImplementation(() => ({}))
    mockWorkspaceUpdate.mockImplementation(() => jest.fn)
    mockGeometryGet.mockImplementation(() => ({
      uploadfilename: 'uploadfilename'
    }))
    mockGeometryAdd.mockImplementation(() => ({ id: 'newid' }))
    mockSimulationGet.mockImplementation(() => ({
      scheme: {
        configuration: {
          geometry: {
            children: [{}]
          }
        }
      }
    }))
    await Project.copy(
      { id: 'userid' },
      { id: 'workspaceid' },
      { id: 'projectid' }
    )

    // With geometry value/values
    mockSimulationGet.mockImplementation(() => ({
      scheme: {
        configuration: {
          geometry: {
            children: [
              {
                value: 'id1'
              }
            ]
          }
        }
      }
    }))

    await Project.copy(
      { id: 'userid' },
      { id: 'workspaceid' },
      { id: 'projectid' }
    )
  })
})
