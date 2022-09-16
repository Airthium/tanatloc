import toThree from '../toThree'

const mockExecSync = jest.fn()
jest.mock('child_process', () => ({
  execSync: () => mockExecSync()
}))

const mockIsDocker = jest.fn()
jest.mock('is-docker', () => () => mockIsDocker())

const mockDocker = jest.fn()
jest.mock('../docker', () => () => mockDocker())

describe('services/toThree', () => {
  beforeEach(() => {
    mockExecSync.mockReset()
    mockExecSync.mockImplementation(() => '')

    mockIsDocker.mockReset()

    mockDocker.mockReset()
  })

  test('call', async () => {
    Object.defineProperty(process, 'platform', {
      value: 'linux',
      configurable: true
    })
    let res: { code: number }

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

    // Step
    res = await toThree('path', 'file.step', 'pathout')
    expect(res.code).toBe(0)

    res = await toThree('path', 'file.stp', 'pathout')
    expect(res.code).toBe(0)

    // Dxf
    res = await toThree('path', 'file.dxf', 'pathout')
    expect(res.code).toBe(0)

    // Msh
    res = await toThree('path', 'file.msh', 'pathout')
    expect(res.code).toBe(0)

    // VTU
    res = await toThree('path', 'file.vtu', 'pathout')
    expect(mockExecSync).toHaveBeenCalledTimes(0)
    expect(res.code).toBe(0)

    // Unknow
    try {
      await toThree('path', 'file.other', 'pathout')
      expect(true).toBe(false)
    } catch (err) {
      expect(true).toBe(true)
    } finally {
      expect(mockExecSync).toHaveBeenCalledTimes(0)
    }

    // Error
    try {
      mockDocker.mockImplementation(() => ({
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
    }
  })

  test('isDocker', async () => {
    mockIsDocker.mockImplementation(() => true)

    const res = await toThree('path', 'file.step', 'pathour')
    expect(mockExecSync).toHaveBeenCalledTimes(1)
    expect(res.code).toBe(0)
  })
})
