/**
 * @jest-environment node
 */

const { convert } = require('..')

jest.mock('path', () => ({
  join: () => 'path'
}))

const mockSpawn = jest.fn()
jest.mock('child_process', () => ({
  spawn: () => mockSpawn()
}))

describe('modules/three-to-glb', () => {
  beforeEach(() => {
    mockSpawn.mockReset()
    mockSpawn.mockImplementation(() => ({
      stdout: {
        on: (_, callback) => callback()
      },
      stderr: {
        on: (_, callback) => callback()
      },
      on: (type, callback) => {
        if (type === 'close') callback()
      }
    }))
  })

  test('convert', async () => {
    await convert('location', 'name')
    expect(mockSpawn).toHaveBeenCalledTimes(1)
  })

  test('convert error', async () => {
    mockSpawn.mockImplementation(() => ({
      stdout: {
        on: (_, callback) => callback()
      },
      stderr: {
        on: (_, callback) => callback()
      },
      on: (type, callback) => {
        if (type === 'error') callback()
      }
    }))
    try {
      await convert('location', 'name')
    } catch (err) {
    } finally {
      expect(mockSpawn).toHaveBeenCalledTimes(1)
    }
  })
})
