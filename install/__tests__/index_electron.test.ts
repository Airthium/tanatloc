/**
 * @jest-environment node
 */

Object.defineProperty(process, 'env', { value: { CI: 0 } })

import main from '..'

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
  test('call', async () => {
    await main()
  })
})
