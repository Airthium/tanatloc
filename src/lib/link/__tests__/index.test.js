import { expect } from '@jest/globals'
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
    await Link.add({})
    expect(mockLinkAdd).toHaveBeenCalledTimes(1)
  })

  test('get', async () => {
    await Link.get('id', ['data'])
    expect(mockLinkGet).toHaveBeenCalledTimes(1)
  })

  test('process', async () => {
    // Subscribe
    mockLinkGet.mockImplementation(() => ({
      type: 'subscribe',
      userid: 'userid'
    }))
    await Link.process('id', {})
    expect(mockUserUpdate).toHaveBeenCalledTimes(1)
    expect(mockLinkDel).toHaveBeenCalledTimes(1)

    // Password recovery, wrong email
    mockLinkGet.mockImplementation(() => ({
      type: 'passwordRecovery',
      email: 'email'
    }))
    try {
      await Link.process('id', { email: 'otheremail' })
    } catch (err) {
      expect(err.message).toBe('Inconsistent data')
    }

    // Pasword recovery
    mockUserGetBy.mockImplementation(() => ({}))
    await Link.process('id', { email: 'email' })
    expect(mockUserGetBy).toHaveBeenCalledTimes(1)
    expect(mockUserUpdate).toHaveBeenCalledTimes(2)
    expect(mockLinkDel).toHaveBeenCalledTimes(2)
  })

  test('del', async () => {
    await Link.del({})
    expect(mockLinkDel).toHaveBeenCalledTimes(1)
  })
})
