import Project from '../project'

const mockAdd = jest.fn()
const mockGet = jest.fn()
const mockUpdate = jest.fn()
const mockDelete = jest.fn()
jest.mock('../../database/project', () => ({
  add: async () => mockAdd(),
  get: async () => mockGet(),
  update: async () => mockUpdate(),
  del: async () => mockDelete()
}))

const mockAvatar = jest.fn()
jest.mock('../avatar', () => ({
  read: async (val) => mockAvatar(val)
}))

const mockGetUser = jest.fn()
jest.mock('../user', () => ({
  get: async (val) => mockGetUser(val)
}))

const mockUpdateWorkspace = jest.fn()
jest.mock('../workspace', () => ({
  update: async () => mockUpdateWorkspace()
}))

const mockDelSimulation = jest.fn()
jest.mock('../simulation', () => ({
  del: async () => mockDelSimulation()
}))

describe('src/lib/project', () => {
  beforeEach(() => {
    mockAdd.mockReset()
    mockGet.mockReset()
    mockUpdate.mockReset()
    mockDelete.mockReset()

    mockAvatar.mockReset()

    mockGetUser.mockReset()

    mockUpdateWorkspace.mockReset()

    mockDelSimulation.mockReset()
  })

  it('add', async () => {
    mockAdd.mockImplementation(() => ({ id: 'id' }))
    const project = await Project.add({}, { workspace: {}, project: {} })
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

  it('get', async () => {
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

    // With avatar, owners, users
    mockGet.mockImplementation(() => ({
      avatar: 'avatar',
      owners: ['owner'],
      users: ['user']
    }))
    mockAvatar.mockImplementation((val) => val)
    mockGetUser.mockImplementation((val) => val)
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
      owners: ['owner'],
      users: ['user']
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
      owners: ['owner'],
      users: ['user']
    })
  })

  it('update', async () => {
    await Project.update({}, {})
    expect(mockAdd).toHaveBeenCalledTimes(0)
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(mockDelete).toHaveBeenCalledTimes(0)
    expect(mockAvatar).toHaveBeenCalledTimes(0)
    expect(mockGetUser).toHaveBeenCalledTimes(0)
    expect(mockUpdateWorkspace).toHaveBeenCalledTimes(0)
    expect(mockDelSimulation).toHaveBeenCalledTimes(0)
  })

  it('delete', async () => {
    // Without simulations
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

    // With simulations
    mockGet.mockImplementation(() => ({ simulations: ['id'] }))
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
