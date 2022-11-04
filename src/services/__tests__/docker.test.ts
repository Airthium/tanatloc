import docker from '../docker'

const mockExecSync = jest.fn()
const mockSpawn = jest.fn()
jest.mock('child_process', () => ({
  execSync: () => mockExecSync(),
  spawn: () => mockSpawn()
}))

const mockUuid = jest.fn()
jest.mock('uuid', () => ({
  v4: () => mockUuid()
}))

describe('services/docker', () => {
  // Default to linux
  Object.defineProperty(process, 'platform', {
    value: 'linux',
    configurable: true
  })

  beforeEach(() => {
    mockExecSync.mockReset()
    mockSpawn.mockReset()
    mockSpawn.mockImplementation(() => ({
      on: (_: string, callback: Function) => {
        callback()
      }
    }))

    mockUuid.mockReset()
  })

  test('Docker engin', () => {
    mockExecSync.mockImplementation(() => '')
    docker('bindPath', 'command')
  })

  test('Docker Desktop', () => {
    mockExecSync.mockImplementation(() => 'Docker Desktop')
    docker('bindPath', 'command')
  })

  test('close error', () => {
    mockExecSync
      .mockImplementationOnce(() => '')
      .mockImplementationOnce(() => '')
      .mockImplementationOnce(() => '')
      .mockImplementationOnce(() => {
        throw new Error('docker stop error')
      })
    docker('bindPath', 'command')
  })

  test('win32', () => {
    Object.defineProperty(process, 'platform', {
      value: 'win32',
      configurable: true
    })
    mockExecSync.mockImplementation(() => '')
    docker('bindPath', 'command')
  })
})
