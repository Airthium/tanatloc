import custom from '../custom'

const mockExecSync = jest.fn()
const mockSpawn = jest.fn()
jest.mock('child_process', () => ({
  execSync: () => mockExecSync(),
  spawn: () => mockSpawn()
}))

const mockIsDocker = jest.fn()
jest.mock('is-docker', () => () => mockIsDocker())

const mockDocker = jest.fn()
jest.mock('../docker', () => () => mockDocker())

describe('services/custom', () => {
  const mockCallback = jest.fn()

  beforeEach(() => {
    mockExecSync.mockReset()
    mockExecSync.mockImplementation(() => '')
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
    const { code } = await custom('path', 'script', ['arg'])
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
      await custom('path', 'script', ['arg'])
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
    const { code } = await custom('path', 'script', ['arg'])
    expect(mockExecSync).toHaveBeenCalledTimes(1)
    expect(code).toBe(0)
  })
})
