/**
 * @jest-environment node
 */

Object.defineProperty(process, 'env', { value: { CI: 1 } })
// process.env.CI = 1

import '..'

jest.mock('is-electron', () => () => false)

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
