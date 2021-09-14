/**
 * @jest-environment node
 */

import install from '..'

jest.mock('../copyAssets', () =>
  jest.fn(() => {
    throw new Error()
  })
)
jest.mock('../createDatabase', () => jest.fn())
jest.mock('../createPaths', () => jest.fn())

describe('install', () => {
  test('call', () => {
    expect(install).toBeDefined()
  })
})
