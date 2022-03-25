import Project from '../'

jest.mock('@/config/storage', () => ({
  STORAGE: 'storage'
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
  read: async (val) => mockAvatarRead(val),
  archive: async () => mockAvatarArchive()
}))

const mockUserGet = jest.fn()
const mockUserGetWithData = jest.fn()
jest.mock('../../user', () => ({
  get: async (val) => mockUserGet(val),
  getWithData: async () => mockUserGetWithData()
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

const mockGeometryArchive = jest.fn()
jest.mock('../../geometry', () => ({
  archive: async () => mockGeometryArchive()
}))

const mockSimulationDel = jest.fn()
const mockSimulationArchive = jest.fn()
jest.mock('../../simulation', () => ({
  del: async () => mockSimulationDel(),
  archive: async () => mockSimulationArchive()
}))

const mockToolsCreatePath = jest.fn()
const mockToolsWriteFile = jest.fn()
const mockToolsArchive = jest.fn()
const mockToolsReadStream = jest.fn()
const mockToolsRemoveDirectory = jest.fn()
jest.mock('../../tools', () => ({
  createPath: async () => mockToolsCreatePath(),
  writeFile: async () => mockToolsWriteFile(),
  archive: () => mockToolsArchive(),
  readStream: async () => mockToolsReadStream(),
  removeDirectory: async () => mockToolsRemoveDirectory()
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

    mockGroupGet.mockReset()
    mockGroupGetWithData.mockReset()
    mockGroupUpdate.mockReset()

    mockWorkspaceUpdate.mockReset()

    mockGeometryArchive.mockReset()

    mockSimulationDel.mockReset()
    mockSimulationArchive.mockReset()

    mockToolsCreatePath.mockReset()
    mockToolsWriteFile.mockReset()
    mockToolsArchive.mockReset()
    mockToolsReadStream.mockReset()
    mockToolsRemoveDirectory.mockReset()
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
    project = await Project.getWithData('id', ['name'])
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(project).toEqual({})

    // With avatar, owners, users & groups
    mockGet.mockImplementation(() => ({
      avatar: 'avatar',
      owners: ['owner'],
      users: ['user'],
      groups: ['group']
    }))
    mockAvatarRead.mockImplementation((val) => val)
    project = await Project.getWithData('id', ['name'])
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockAvatarRead).toHaveBeenCalledTimes(1)
    expect(mockUserGetWithData).toHaveBeenCalledTimes(2)
    expect(project).toEqual({
      avatar: 'avatar',
      owners: [{ id: 'owner' }],
      users: [{ id: 'user' }],
      groups: [{ id: 'group' }]
    })

    // With avatar error
    mockAvatarRead.mockImplementation(() => {
      throw new Error()
    })
    project = await Project.getWithData('id', ['name'])
    expect(mockGet).toHaveBeenCalledTimes(3)
    expect(mockAvatarRead).toHaveBeenCalledTimes(2)
    expect(mockUserGetWithData).toHaveBeenCalledTimes(4)
    expect(mockWorkspaceUpdate).toHaveBeenCalledTimes(0)
    expect(project).toEqual({
      avatar: undefined,
      owners: [{ id: 'owner' }],
      users: [{ id: 'user' }],
      groups: [{ id: 'group' }]
    })

    // Archived
    mockGet.mockImplementation(() => ({
      archived: true
    }))
    project = await Project.getWithData('id', ['name'])
    expect(mockGet).toHaveBeenCalledTimes(4)
    expect(project).toEqual({
      archived: true
    })
  })

  test('update', async () => {
    mockGet.mockImplementation(() => ({}))
    mockGroupGet.mockImplementation(() => ({ projects: [] }))
    await Project.update({ id: 'id' }, [{ key: 'groups', value: ['id'] }])
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledTimes(1)

    // With groups
    mockGet.mockImplementation(() => ({
      groups: ['id1']
    }))
    await Project.update({ id: 'id' }, [{ key: 'groups', value: ['id'] }])
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockUpdate).toHaveBeenCalledTimes(2)

    // No groups update
    await Project.update({ id: 'id' }, [])
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockUpdate).toHaveBeenCalledTimes(3)
  })

  test('delete', async () => {
    // Without simulations & groups
    mockGet.mockImplementation(() => ({}))
    await Project.del({ id: 'id' }, { id: 'id' })
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockDelete).toHaveBeenCalledTimes(1)
    expect(mockWorkspaceUpdate).toHaveBeenCalledTimes(1)

    // With simulations & groups
    mockGet.mockImplementation(() => ({ groups: ['id'], simulations: ['id'] }))
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
})
