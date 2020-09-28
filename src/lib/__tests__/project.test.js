import { add, get, update, del } from '../project'

let mockGet
const mockUpdate = jest.fn()
const mockDelete = jest.fn()
jest.mock('../../database/project', () => ({
  add: async () => ({ id: 'add' }),
  get: async () => mockGet(),
  update: async () => mockUpdate(),
  del: async () => mockDelete()
}))

let mockAvatar
jest.mock('../avatar', () => ({
  read: async (val) => mockAvatar(val)
}))

jest.mock('../user', () => ({
  get: async (val) => val
}))

const mockWorkspace = jest.fn()
jest.mock('../workspace', () => ({
  update: async () => mockWorkspace()
}))

describe('src/lib/project', () => {
  beforeEach(() => {
    mockAvatar = (val) => val
    mockUpdate.mockReset()
    mockDelete.mockReset()
    mockWorkspace.mockReset()
  })

  it('add', async () => {
    const project = await add({}, { workspace: {}, project: {} })
    expect(project).toEqual({ id: 'add' })
    expect(mockWorkspace).toHaveBeenCalledTimes(1)
  })

  it('get', async () => {
    let project

    // Empty
    mockGet = () => ({})
    project = await get()
    expect(project).toEqual({})

    // With avatar, owners, users
    mockGet = () => ({
      avatar: 'avatar',
      owners: ['owner'],
      users: ['user']
    })
    project = await get()
    expect(project).toEqual({
      avatar: 'avatar',
      owners: ['owner'],
      users: ['user']
    })

    // With avatar error
    mockAvatar = async () => {
      throw new Error()
    }
    project = await get()
    expect(project).toEqual({
      avatar: undefined,
      owners: ['owner'],
      users: ['user']
    })
  })

  it('update', async () => {
    await update({}, {})
    expect(mockUpdate).toHaveBeenCalledTimes(1)
  })

  it('delete', async () => {
    await del({}, {})
    expect(mockDelete).toHaveBeenCalledTimes(1)
    expect(mockWorkspace).toHaveBeenCalledTimes(1)
  })
})
