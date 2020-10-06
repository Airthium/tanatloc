import { add, read, del } from '../avatar'

jest.mock('path', () => ({
  join: () => 'path'
}))

jest.mock('fs', () => ({
  promises: {
    readFile: async () => 'avatar'
  }
}))

let mockAdd
let mockGet
const mockDel = jest.fn()
jest.mock('../../database/avatar', () => ({
  add: async () => mockAdd(),
  get: async () => mockGet(),
  del: async () => mockDel()
}))

let mockGetUser
const mockUpdateUser = jest.fn()
jest.mock('../user', () => ({
  get: async () => mockGetUser(),
  update: async () => mockUpdateUser()
}))

jest.mock('../tools', () => ({
  writeFile: async () => {}
}))

describe('src/lib/avatar', () => {
  beforeEach(() => {
    mockDel.mockReset()
    mockUpdateUser.mockReset()
    mockAdd = () => ({
      id: 'id'
    })
    mockGet = () => ({
      path: 'path'
    })
    mockGetUser = () => ({})
  })

  it('add', async () => {
    let avatar

    avatar = await add({}, {})
    expect(avatar).toEqual({ id: 'id' })
    expect(mockUpdateUser).toHaveBeenCalledTimes(1)

    // With user avatar
    mockGetUser = () => ({
      avatar: 'avatar'
    })
    avatar = await add({}, {})
    expect(avatar).toEqual({ id: 'id' })
    expect(mockDel).toHaveBeenCalledTimes(1)
    expect(mockUpdateUser).toHaveBeenCalledTimes(3)
  })

  it('read', async () => {
    const avatar = await read('id')
    expect(avatar).toBe('avatar')
  })

  it('del', async () => {
    await del({}, 'id')
    expect(mockDel).toHaveBeenCalledTimes(1)
    expect(mockUpdateUser).toHaveBeenCalledTimes(1)
  })
})
