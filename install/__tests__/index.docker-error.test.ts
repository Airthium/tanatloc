/**
 * @jest-environment node
 */

Object.defineProperty(process, 'env', { value: { CI: 0 } })

import install from '../'

jest.mock('is-electron', () => () => true)

jest.mock('is-docker', () => () => false)

const mockExecSync = jest.fn()
jest.mock('child_process', () => ({
  execSync: () => mockExecSync()
}))

jest.mock('../copyAssets', () => ({
  copyAssets: jest.fn
}))
jest.mock('../createDatabase', () => ({
  createDatabase: jest.fn
}))
jest.mock('../createPaths', () => ({
  createPaths: jest.fn
}))

describe('install', () => {
  beforeEach(() => {
    mockExecSync.mockReset()
    mockExecSync
      .mockImplementationOnce(() => {
        throw new Error()
      })
      .mockImplementationOnce(() => {
        throw new Error()
      })
      .mockImplementationOnce(() => '')
  })

  test('call', () => {
    install({ addStatus: async () => undefined })
  })
})
