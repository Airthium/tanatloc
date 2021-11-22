/**
 * @jest-environment node
 */

import '..'

jest.mock('is-electron', () => () => true)

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
