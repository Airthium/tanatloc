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

const mockGetUser = jest.fn()
jest.mock('../../user', () => ({
  get: async (val) => mockGetUser(val)
}))

const mockGetGroup = jest.fn()
const mockUpdateGroup = jest.fn()
jest.mock('../../group', () => ({
  get: async () => mockGetGroup(),
  update: async () => mockUpdateGroup()
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

    mockGetUser.mockReset()

    mockGetGroup.mockReset()
    mockUpdateGroup.mockReset()

    mockUpdateWorkspace.mockReset()

    mockDelSimulation.mockReset()
  })

  test('add', async () => {
    mockAdd.mockImplementation(() => ({ id: 'id' }))
    const project = await Project.add({}, {}, {})
    expect(mockAdd).toHaveBeenCalledTimes(1)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDelete).toHaveBeenCalledTimes(0)
    expect(mockAvatar).toHaveBeenCalledTimes(0)
    expect(mockGetUser).toHaveBeenCalledTimes(0)
    expect(mockUpdateWorkspace).toHaveBeenCalledTimes(1)
    expect(mockDelSimulation).toHaveBeenCalledTimes(0)
    expect(project).toEqual({ id: 'id' })
  })

  test('get', async () => {
    let project

    // Empty
    mockGet.mockImplementation(() => ({}))
    project = await Project.get()
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDelete).toHaveBeenCalledTimes(0)
    expect(mockAvatar).toHaveBeenCalledTimes(0)
    expect(mockGetUser).toHaveBeenCalledTimes(0)
    expect(mockUpdateWorkspace).toHaveBeenCalledTimes(0)
    expect(mockDelSimulation).toHaveBeenCalledTimes(0)
    expect(project).toEqual({})

    // With avatar, owners, users & groups
    mockGet.mockImplementation(() => ({
      avatar: 'avatar',
      owners: ['owner'],
      users: ['user'],
      groups: ['group']
    }))
    mockAvatar.mockImplementation((val) => val)
    project = await Project.get()
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDelete).toHaveBeenCalledTimes(0)
    expect(mockAvatar).toHaveBeenCalledTimes(1)
    expect(mockGetUser).toHaveBeenCalledTimes(2)
    expect(mockUpdateWorkspace).toHaveBeenCalledTimes(0)
    expect(mockDelSimulation).toHaveBeenCalledTimes(0)
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
    project = await Project.get()
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(3)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDelete).toHaveBeenCalledTimes(0)
    expect(mockAvatar).toHaveBeenCalledTimes(2)
    expect(mockGetUser).toHaveBeenCalledTimes(4)
    expect(mockUpdateWorkspace).toHaveBeenCalledTimes(0)
    expect(mockDelSimulation).toHaveBeenCalledTimes(0)
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
    project = await Project.get()
    expect(mockGet).toHaveBeenCalledTimes(4)
    expect(project).toEqual({
      archived: true,
      avatar: null
    })
  })

  test('update', async () => {
    mockGet.mockImplementation(() => ({}))
    await Project.update({}, [{ key: 'groups', value: ['id'] }])
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(mockDelete).toHaveBeenCalledTimes(0)
    expect(mockAvatar).toHaveBeenCalledTimes(0)
    expect(mockGetUser).toHaveBeenCalledTimes(0)
    expect(mockUpdateWorkspace).toHaveBeenCalledTimes(0)
    expect(mockDelSimulation).toHaveBeenCalledTimes(0)

    // With groups
    mockGet.mockImplementation(() => ({
      groups: ['id1']
    }))
    await Project.update({}, [{ key: 'groups', value: ['id'] }])
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockUpdate).toHaveBeenCalledTimes(2)
    expect(mockDelete).toHaveBeenCalledTimes(0)
    expect(mockAvatar).toHaveBeenCalledTimes(0)
    expect(mockGetUser).toHaveBeenCalledTimes(0)
    expect(mockUpdateWorkspace).toHaveBeenCalledTimes(0)
    expect(mockDelSimulation).toHaveBeenCalledTimes(0)

    // No groups update
    await Project.update({}, [])
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockUpdate).toHaveBeenCalledTimes(3)
    expect(mockDelete).toHaveBeenCalledTimes(0)
    expect(mockAvatar).toHaveBeenCalledTimes(0)
    expect(mockGetUser).toHaveBeenCalledTimes(0)
    expect(mockUpdateWorkspace).toHaveBeenCalledTimes(0)
    expect(mockDelSimulation).toHaveBeenCalledTimes(0)
  })

  test('delete', async () => {
    // Without simulations & groups
    mockGet.mockImplementation(() => ({}))
    await Project.del({}, {})
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDelete).toHaveBeenCalledTimes(1)
    expect(mockAvatar).toHaveBeenCalledTimes(0)
    expect(mockGetUser).toHaveBeenCalledTimes(0)
    expect(mockUpdateWorkspace).toHaveBeenCalledTimes(1)
    expect(mockDelSimulation).toHaveBeenCalledTimes(0)

    // With simulations & groups
    mockGet.mockImplementation(() => ({ groups: ['id'], simulations: ['id'] }))
    await Project.del({}, {})
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockUpdate).toHaveBeenCalledTimes(0)
    expect(mockDelete).toHaveBeenCalledTimes(2)
    expect(mockAvatar).toHaveBeenCalledTimes(0)
    expect(mockGetUser).toHaveBeenCalledTimes(0)
    expect(mockUpdateWorkspace).toHaveBeenCalledTimes(2)
    expect(mockDelSimulation).toHaveBeenCalledTimes(1)
  })
})
