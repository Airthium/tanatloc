/**
 * @jest-environment node
 */

import copyAssets from '../copyAssets'

const mockMkdir = jest.fn()
jest.mock('fs', () => ({
  promises: {
    mkdir: async () => mockMkdir()
  }
}))

const mockNcp = jest.fn()
jest.mock('ncp', () => (_, __, callback) => mockNcp(callback))

describe('install/copyAssets', () => {
  beforeEach(() => {
    mockMkdir.mockReset()

    mockNcp.mockReset()
    mockNcp.mockImplementation((callback) => callback())
  })

  test('normal', async () => {
    await copyAssets()
    expect(mockMkdir).toHaveBeenCalledTimes(1)
    expect(mockNcp).toHaveBeenCalledTimes(1)
  })

  test('error', async () => {
    mockNcp.mockImplementation((callback) => callback(new Error('ncp error')))
    try {
      await copyAssets()
      expect(true).toBe(false)
    } catch (err) {
      expect(err.message).toBe('ncp error')
    }

    mockMkdir.mockImplementation(() => {
      const error = new Error()
      error.code = 'EEXIST'
      throw error
    })
    try {
      await copyAssets()
      expect(true).toBe(false)
    } catch (err) {
      expect(err.message).toBe('ncp error')
    }

    mockMkdir.mockImplementation(() => {
      throw new Error('mkdir error')
    })
    try {
      await copyAssets()
      expect(true).toBe(false)
    } catch (err) {
      expect(err.message).toBe('mkdir error')
    }
  })
})
