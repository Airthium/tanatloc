import gmsh from '../gmsh'

const mockExecSync = jest.fn()
const mockSpawn = jest.fn()
jest.mock('child_process', () => ({
  execSync: () => mockExecSync(),
  spawn: () => mockSpawn()
}))

const mockDocker = jest.fn()
jest.mock('is-docker', () => () => mockDocker())

describe('services/gmsh', () => {
  const mockCallback = jest.fn()

  beforeEach(() => {
    mockExecSync.mockReset()
    mockExecSync.mockImplementation(() => '')
    mockSpawn.mockReset()

    mockDocker.mockReset()

    mockCallback.mockReset()
  })

  test('gmsh - linux', async () => {
    Object.defineProperty(process, 'platform', {
      value: 'linux',
      configurable: true
    })
    // Normal
    mockSpawn.mockImplementation(() => ({
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
    const code = await gmsh('path', 'fileIn', 'fileOut', mockCallback)
    expect(mockExecSync).toHaveBeenCalledTimes(2)
    expect(mockSpawn).toHaveBeenCalledTimes(1)
    expect(code).toBe(0)

    // Error
    try {
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
          if (arg === 'error') callback('error')
        }
      }))
      await gmsh('path', 'fileIn', 'fileOut', mockCallback)
      expect(true).toBe(false)
    } catch (err) {
      expect(true).toBe(true)
    } finally {
      expect(mockExecSync).toHaveBeenCalledTimes(4)
      expect(mockSpawn).toHaveBeenCalledTimes(2)
    }
  })

  test('gmsh - win32', async () => {
    Object.defineProperty(process, 'platform', {
      value: 'win32',
      configurable: true
    })
    // Normal
    mockSpawn.mockImplementation(() => ({
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
    const code = await gmsh('path', 'fileIn', 'fileOut', mockCallback)
    expect(mockExecSync).toHaveBeenCalledTimes(0)
    expect(mockSpawn).toHaveBeenCalledTimes(1)
    expect(code).toBe(0)

    // Error
    try {
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
          if (arg === 'error') callback('error')
        }
      }))
      await gmsh('path', 'fileIn', 'fileOut', mockCallback)
      expect(true).toBe(false)
    } catch (err) {
      expect(true).toBe(true)
    } finally {
      expect(mockExecSync).toHaveBeenCalledTimes(0)
      expect(mockSpawn).toHaveBeenCalledTimes(2)
    }
  })

  test('isDocker', async () => {
    mockDocker.mockImplementation(() => true)

    mockSpawn.mockImplementation(() => ({
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
    const code = await gmsh('path', 'fileIn', 'fileOut', mockCallback)
    expect(mockExecSync).toHaveBeenCalledTimes(0)
    expect(mockSpawn).toHaveBeenCalledTimes(1)
    expect(code).toBe(0)
  })
})
