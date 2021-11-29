/**
 * @jest-environment node
 */

import '..'

jest.mock('is-electron', () => () => false)

jest.mock('../copyAssets', () => ({
  copyAssets: jest.fn(() => {
    throw new Error()
  })
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
