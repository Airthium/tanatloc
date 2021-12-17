/**
 * @jest-environment node
 */

import { copyAssets } from '../copyAssets'

const mockMkdir = jest.fn()
const mockCp = jest.fn()
jest.mock('fs', () => ({
  promises: {
    mkdir: async () => mockMkdir(),
    cp: async () => mockCp()
  }
}))

describe('install/copyAssets', () => {
  beforeEach(() => {
    mockMkdir.mockReset()
    mockCp.mockReset()
  })

  test('normal', async () => {
    await copyAssets()
    expect(mockMkdir).toHaveBeenCalledTimes(1)
    expect(mockCp).toHaveBeenCalledTimes(1)
  })

  test('error', async () => {
    mockCp.mockImplementation(() => {
      throw new Error('cp error')
    })
    try {
      await copyAssets()
      expect(true).toBe(false)
    } catch (err) {
      expect(err.message).toBe('cp error')
    }

    mockMkdir.mockImplementation(() => {
      const error: Error & { code?: string } = new Error()
      error.code = 'EEXIST'
      throw error
    })
    try {
      await copyAssets()
      expect(true).toBe(false)
    } catch (err) {
      expect(err.message).toBe('cp error')
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
