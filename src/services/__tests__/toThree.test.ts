import toThree from '../toThree'

const mockExecSync = jest.fn()
const mockSpawn = jest.fn()
jest.mock('child_process', () => ({
  execSync: () => mockExecSync(),
  spawn: () => mockSpawn()
}))

const mockDocker = jest.fn()
jest.mock('is-docker', () => () => mockDocker())

describe('services/toThree', () => {
  beforeEach(() => {
    mockExecSync.mockReset()
    mockExecSync.mockImplementation(() => '')
    mockSpawn.mockReset()

    mockDocker.mockReset()
  })

  test('toThree - linux', async () => {
    Object.defineProperty(process, 'platform', {
      value: 'linux',
      configurable: true
    })
    let res: { code: number }

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

    // Step
    res = await toThree('path', 'file.step', 'pathout')
    expect(mockExecSync).toHaveBeenCalledTimes(2)
    expect(mockSpawn).toHaveBeenCalledTimes(1)
    expect(res.code).toBe(0)

    res = await toThree('path', 'file.stp', 'pathout')
    expect(mockExecSync).toHaveBeenCalledTimes(4)
    expect(mockSpawn).toHaveBeenCalledTimes(2)
    expect(res.code).toBe(0)

    // Dxf
    res = await toThree('path', 'file.dxf', 'pathout')
    expect(mockExecSync).toHaveBeenCalledTimes(6)
    expect(mockSpawn).toHaveBeenCalledTimes(3)
    expect(res.code).toBe(0)

    // Msh
    res = await toThree('path', 'file.msh', 'pathout')
    expect(mockExecSync).toHaveBeenCalledTimes(8)
    expect(mockSpawn).toHaveBeenCalledTimes(4)
    expect(res.code).toBe(0)

    // VTU
    res = await toThree('path', 'file.vtu', 'pathout')
    expect(mockExecSync).toHaveBeenCalledTimes(10)
    expect(mockSpawn).toHaveBeenCalledTimes(5)
    expect(res.code).toBe(0)

    // Unknow
    try {
      await toThree('path', 'file.other', 'pathout')
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
        on: (arg: string, callback: Function) => {
          if (arg === 'error') callback('error')
        }
      }))
      await toThree('path', 'file.step', 'pathout')
      expect(true).toBe(false)
    } catch (err) {
      expect(true).toBe(true)
    } finally {
      expect(mockExecSync).toHaveBeenCalledTimes(12)
      expect(mockSpawn).toHaveBeenCalledTimes(6)
    }
  })

  test('toThree - win32', async () => {
    Object.defineProperty(process, 'platform', {
      value: 'win32',
      configurable: true
    })
    let res: { code: number }

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

    // Step
    res = await toThree('path', 'file.step', 'pathout')
    expect(mockExecSync).toHaveBeenCalledTimes(0)
    expect(mockSpawn).toHaveBeenCalledTimes(1)
    expect(res.code).toBe(0)

    res = await toThree('path', 'file.stp', 'pathout')
    expect(mockExecSync).toHaveBeenCalledTimes(0)
    expect(mockSpawn).toHaveBeenCalledTimes(2)
    expect(res.code).toBe(0)

    // Dxf
    res = await toThree('path', 'file.dxf', 'pathout')
    expect(mockExecSync).toHaveBeenCalledTimes(0)
    expect(mockSpawn).toHaveBeenCalledTimes(3)
    expect(res.code).toBe(0)

    // Msh
    res = await toThree('path', 'file.msh', 'pathout')
    expect(mockExecSync).toHaveBeenCalledTimes(0)
    expect(mockSpawn).toHaveBeenCalledTimes(4)
    expect(res.code).toBe(0)

    // VTU
    res = await toThree('path', 'file.vtu', 'pathout')
    expect(mockExecSync).toHaveBeenCalledTimes(0)
    expect(mockSpawn).toHaveBeenCalledTimes(5)
    expect(res.code).toBe(0)

    // Unknow
    try {
      await toThree('path', 'file.other', 'pathout')
      expect(true).toBe(false)
    } catch (err) {
      expect(true).toBe(true)
    } finally {
      expect(mockExecSync).toHaveBeenCalledTimes(0)
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
        on: (arg: string, callback: Function) => {
          if (arg === 'error') callback('error')
        }
      }))
      await toThree('path', 'file.step', 'pathout')
      expect(true).toBe(false)
    } catch (err) {
      expect(true).toBe(true)
    } finally {
      expect(mockExecSync).toHaveBeenCalledTimes(0)
      expect(mockSpawn).toHaveBeenCalledTimes(6)
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
    const res = await toThree('path', 'file.step', 'pathour')
    expect(mockExecSync).toHaveBeenCalledTimes(1)
    expect(mockSpawn).toHaveBeenCalledTimes(0)
    expect(res.code).toBe(0)
  })
})
