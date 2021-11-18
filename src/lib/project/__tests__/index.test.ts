import Project from '../'

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

const mockAvatar = jest.fn()
jest.mock('../../avatar', () => ({
  read: async (val) => mockAvatar(val)
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

const mockUpdateWorkspace = jest.fn()
jest.mock('../../workspace', () => ({
  update: async () => mockUpdateWorkspace()
}))

const mockDelSimulation = jest.fn()
jest.mock('../../simulation', () => ({
  del: async () => mockDelSimulation()
}))

describe('lib/project', () => {
  beforeEach(() => {
    mockAdd.mockReset()
    mockGet.mockReset()
    mockUpdate.mockReset()
    mockDelete.mockReset()

    mockAvatar.mockReset()

    mockUserGet.mockReset()
    mockUserGetWithData.mockReset()

    mockGroupGet.mockReset()
    mockGroupGetWithData.mockReset()
    mockGroupUpdate.mockReset()

    mockUpdateWorkspace.mockReset()

    mockDelSimulation.mockReset()
  })

  test('add', async () => {
    mockAdd.mockImplementation(() => ({ id: 'id' }))
    const project = await Project.add(
      { id: 'id' },
      { id: 'id' },
      { title: 'title', description: 'description' }
    )
    expect(mockAdd).toHaveBeenCalledTimes(1)
    expect(mockUpdateWorkspace).toHaveBeenCalledTimes(1)
    expect(project).toEqual({ id: 'id' })
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
    mockAvatar.mockImplementation((val) => val)
    project = await Project.getWithData('id', ['name'])
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockAvatar).toHaveBeenCalledTimes(1)
    expect(mockUserGetWithData).toHaveBeenCalledTimes(2)
    expect(project).toEqual({
      avatar: 'avatar',
      owners: [{ id: 'owner' }],
      users: [{ id: 'user' }],
      groups: [{ id: 'group' }]
    })

    // With avatar error
    mockAvatar.mockImplementation(() => {
      throw new Error()
    })
    project = await Project.getWithData('id', ['name'])
    expect(mockGet).toHaveBeenCalledTimes(3)
    expect(mockAvatar).toHaveBeenCalledTimes(2)
    expect(mockUserGetWithData).toHaveBeenCalledTimes(4)
    expect(mockUpdateWorkspace).toHaveBeenCalledTimes(0)
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
    expect(mockUpdateWorkspace).toHaveBeenCalledTimes(1)

    // With simulations & groups
    mockGet.mockImplementation(() => ({ groups: ['id'], simulations: ['id'] }))
    await Project.del({ id: 'id' }, { id: 'id' })
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockDelete).toHaveBeenCalledTimes(2)
    expect(mockUpdateWorkspace).toHaveBeenCalledTimes(2)
    expect(mockDelSimulation).toHaveBeenCalledTimes(1)
  })
})
