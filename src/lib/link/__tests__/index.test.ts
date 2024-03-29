import Link from '..'

const mockLinkAdd = jest.fn()
const mockLinkGet = jest.fn()
const mockLinkDel = jest.fn()
jest.mock('@/database/link', () => ({
  add: async () => mockLinkAdd(),
  get: async () => mockLinkGet(),
  del: async () => mockLinkDel()
}))

const mockUserGetBy = jest.fn()
const mockUserUpdate = jest.fn()
jest.mock('../../user', () => ({
  getBy: async () => mockUserGetBy(),
  update: async () => mockUserUpdate()
}))

describe('lib/link', () => {
  beforeEach(() => {
    mockLinkAdd.mockReset()
    mockLinkGet.mockReset()
    mockLinkDel.mockReset()

    mockUserGetBy.mockReset()
    mockUserUpdate.mockReset()
  })

  test('add', async () => {
    await Link.add({ type: 'type', email: 'email' })
    expect(mockLinkAdd).toHaveBeenCalledTimes(1)
  })

  test('get', async () => {
    await Link.get('id', ['email'])
    expect(mockLinkGet).toHaveBeenCalledTimes(1)
  })

  test('process', async () => {
    // Subscribe
    mockLinkGet.mockImplementation(() => ({
      type: 'subscribe',
      userid: 'userid'
    }))
    await Link.process('id', { email: 'email', password: 'password' })
    expect(mockUserUpdate).toHaveBeenCalledTimes(1)
    expect(mockLinkDel).toHaveBeenCalledTimes(1)

    // Revalidate
    mockLinkGet.mockImplementation(() => ({
      type: 'revalidate',
      userid: 'userid'
    }))
    await Link.process('id', { email: 'email', password: 'password' })
    expect(mockUserUpdate).toHaveBeenCalledTimes(2)
    expect(mockLinkDel).toHaveBeenCalledTimes(2)

    // Password recovery, wrong email
    mockLinkGet.mockImplementation(() => ({
      type: 'passwordRecovery',
      email: 'email'
    }))
    try {
      await Link.process('id', { email: 'otheremail', password: 'password' })
    } catch (err: any) {
      expect(err.message).toBe('Inconsistent data')
    }

    // Pasword recovery
    mockUserGetBy.mockImplementation(() => ({}))
    await Link.process('id', { email: 'email', password: 'password' })
    expect(mockUserGetBy).toHaveBeenCalledTimes(1)
    expect(mockUserUpdate).toHaveBeenCalledTimes(3)
    expect(mockLinkDel).toHaveBeenCalledTimes(3)

    // Unknown link
    mockLinkGet.mockImplementation(() => ({
      type: 'unknown'
    }))
    try {
      await Link.process('id', { email: 'email', password: 'password' })
      expect(true).toBe(false)
    } catch (err) {
      expect(mockUserUpdate).toHaveBeenCalledTimes(3)
      expect(mockLinkDel).toHaveBeenCalledTimes(4)
    }

    // Undefined
    mockLinkGet.mockImplementation(() => undefined)
    await Link.process('id', { email: 'email', password: 'password' })
  })

  test('del', async () => {
    await Link.del({ id: 'id' })
    expect(mockLinkDel).toHaveBeenCalledTimes(1)
  })
})
