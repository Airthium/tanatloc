import toThree from '../toThree'

const mockExecSync = jest.fn()
const mockSpawn = jest.fn()
jest.mock('child_process', () => ({
  execSync: () => mockExecSync(),
  spawn: () => mockSpawn()
}))

const mockDocker = jest.fn()
jest.mock('is-docker', () => () => mockDocker())

describe('src/services/toThree', () => {
  const mockCallback = jest.fn()

  beforeEach(() => {
    mockExecSync.mockReset()
    mockExecSync.mockImplementation(() => '')
    mockSpawn.mockReset()

    mockDocker.mockReset()

    mockCallback.mockReset()
  })

  it('toThree', async () => {
    let code

    // Normal
    mockSpawn.mockImplementation(() => ({
      stdout: {
        on: (data, callback) => {
          callback('stdout')
        }
      },
      stderr: {
        on: (data, callback) => {
          callback('stderr')
        }
      },
      on: (arg, callback) => {
        if (arg === 'close') callback(0)
      }
    }))

    // Step
    code = await toThree('path', 'file.step', 'pathout', mockCallback)
    expect(mockExecSync).toHaveBeenCalledTimes(2)
    expect(mockSpawn).toHaveBeenCalledTimes(1)
    expect(code).toBe(0)

    code = await toThree('path', 'file.stp', 'pathout', mockCallback)
    expect(mockExecSync).toHaveBeenCalledTimes(4)
    expect(mockSpawn).toHaveBeenCalledTimes(2)
    expect(code).toBe(0)

    // Dxf
    code = await toThree('path', 'file.dxf', 'pathout', mockCallback)
    expect(mockExecSync).toHaveBeenCalledTimes(6)
    expect(mockSpawn).toHaveBeenCalledTimes(3)
    expect(code).toBe(0)

    // Msh
    code = await toThree('path', 'file.msh', 'pathout', mockCallback)
    expect(mockExecSync).toHaveBeenCalledTimes(8)
    expect(mockSpawn).toHaveBeenCalledTimes(4)
    expect(code).toBe(0)

    // VTU
    code = await toThree('path', 'file.vtu', 'pathout', mockCallback)
    expect(mockExecSync).toHaveBeenCalledTimes(10)
    expect(mockSpawn).toHaveBeenCalledTimes(5)
    expect(code).toBe(0)

    // Unknow
    try {
      await toThree('path', 'file.other', 'pathout', mockCallback)
      expect(true).toBe(false)
    } catch (err) {
      expect(true).toBe(true)
    } finally {
      expect(mockExecSync).toHaveBeenCalledTimes(10)
      expect(mockSpawn).toHaveBeenCalledTimes(5)
    }

    // Error
    try {
      mockSpawn.mockImplementation(() => ({
        stdout: {
          on: () => {}
        },
        stderr: {
          on: () => {}
        },
        on: (arg, callback) => {
          if (arg === 'error') callback('error')
        }
      }))
      await toThree('path', 'file.step', 'pathout', mockCallback)
      expect(true).toBe(false)
    } catch (err) {
      expect(true).toBe(true)
    } finally {
      expect(mockExecSync).toHaveBeenCalledTimes(12)
      expect(mockSpawn).toHaveBeenCalledTimes(6)
    }
  })

  it('isDocker', async () => {
    mockDocker.mockImplementation(() => true)

    mockSpawn.mockImplementation(() => ({
      stdout: {
        on: (data, callback) => {
          callback('stdout')
        }
      },
      stderr: {
        on: (data, callback) => {
          callback('stderr')
        }
      },
      on: (arg, callback) => {
        if (arg === 'close') callback(0)
      }
    }))
    const code = await toThree('path', 'file.step', 'pathour', mockCallback)
    expect(mockExecSync).toHaveBeenCalledTimes(0)
    expect(mockSpawn).toHaveBeenCalledTimes(1)
    expect(code).toBe(0)
  })
})
