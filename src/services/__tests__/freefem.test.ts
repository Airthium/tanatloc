import freefem from '../freefem'

const mockSpawn = jest.fn()
jest.mock('child_process', () => ({
  spawn: () => mockSpawn()
}))

const mockIsDocker = jest.fn()
jest.mock('is-docker', () => () => mockIsDocker())

const mockDocker = jest.fn()
jest.mock('../docker', () => () => mockDocker())

describe('services/freefem', () => {
  const mockCallback = jest.fn()

  beforeEach(() => {
    mockSpawn.mockReset()

    mockIsDocker.mockReset()

    mockDocker.mockReset()

    mockCallback.mockReset()
  })

  test('call', async () => {
    // Normal
    mockDocker.mockImplementation(() => ({
      stdout: {
        on: (_: any, callback: Function) => {
          callback('stdout')
        }
      },
      stderr: {
        on: (_: any, callback: Function) => {
          callback('stderr')
        }
      },
      on: (arg: string, callback: Function) => {
        if (arg === 'close') callback(0)
      }
    }))
    const code = await freefem('path', 'script', mockCallback)
    expect(mockSpawn).toHaveBeenCalledTimes(0)
    expect(code).toBe(0)

    // Error
    try {
      mockDocker.mockImplementation(() => ({
        stdout: {
          on: () => {
            // Empty
          }
        },
        stderr: {
          on: () => {
            // Empty
          }
        },
        on: (arg: string, callback: Function) => {
          if (arg === 'error') callback('error')
        }
      }))
      await freefem('path', 'script', mockCallback)
      expect(true).toBe(false)
    } catch (err) {
      expect(true).toBe(true)
    } finally {
      expect(mockSpawn).toHaveBeenCalledTimes(0)
    }
  })

  test('isDocker', async () => {
    mockIsDocker.mockImplementation(() => true)

    mockSpawn.mockImplementation(() => ({
      stdout: {
        on: () => {
          // Empty
        }
      },
      stderr: {
        on: () => {
          // Empty
        }
      },
      on: (arg: string, callback: Function) => {
        if (arg === 'close') callback(0)
      }
    }))
    const code = await freefem('path', 'script', mockCallback)
    expect(mockSpawn).toHaveBeenCalledTimes(1)
    expect(code).toBe(0)
  })

  test('custom', async () => {
    mockSpawn.mockImplementation(() => ({
      stdout: {
        on: () => {
          // Empty
        }
      },
      stderr: {
        on: () => {
          // Empty
        }
      },
      on: (arg: string, callback: Function) => {
        if (arg === 'close') callback(0)
      }
    }))
    const code = await freefem('path', 'script', mockCallback, 'custom')
    expect(mockSpawn).toHaveBeenCalledTimes(1)
    expect(code).toBe(0)
  })
})
