import docker from '../docker'

const mockExecSync = jest.fn()
const mockSpawn = jest.fn()
jest.mock('child_process', () => ({
  execSync: () => mockExecSync(),
  spawn: () => mockSpawn()
}))

const mockReadFileSync = jest.fn()
const mockUnlink = jest.fn()
jest.mock('fs', () => ({
  readFileSync: () => mockReadFileSync(),
  unlinkSync: () => mockUnlink()
}))

const mockUuid = jest.fn()
jest.mock('uuid', () => ({
  v4: () => mockUuid()
}))

describe('services/docker', () => {
  beforeEach(() => {
    mockExecSync.mockReset()
    mockSpawn.mockReset()
    mockSpawn.mockImplementation(() => ({
      on: (_: string, callback: Function) => {
        callback()
      }
    }))

    mockReadFileSync.mockReset()
    mockUnlink.mockReset()

    mockUuid.mockReset()
  })

  test('Docker engin', () => {
    mockExecSync.mockImplementation(() => '')
    mockReadFileSync.mockImplementation(() => '')
    docker('bindPath', 'command')
  })

  test('Docker Desktop', () => {
    mockExecSync.mockImplementation(() => 'Docker Desktop')
    mockReadFileSync.mockImplementation(() => '')
    docker('bindPath', 'command')
  })

  test('close error', () => {
    mockExecSync.mockImplementation(() => '')
    mockReadFileSync.mockImplementation(() => '')
    mockUnlink.mockImplementation(() => {
      throw new Error('unlink error')
    })
    docker('bindPath', 'command')
  })

  test('win32', () => {
    Object.defineProperty(process, 'platform', {
      value: 'win32',
      configurable: true
    })
    mockExecSync.mockImplementation(() => '')
    mockReadFileSync.mockImplementation(() => '')
    docker('bindPath', 'command')
  })
})
