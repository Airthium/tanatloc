/**
 * @jest-environment node
 */

Object.defineProperty(process, 'env', { value: { CI: 0 } })

import '../'

jest.mock('is-electron', () => () => false)

jest.mock('is-docker', () => () => true)

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
  test('call', () => {
    // Empty
  })
})
