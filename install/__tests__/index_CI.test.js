/**
 * @jest-environment node
 */

process.env.CI = 1

import install from '..'

jest.mock('../copyAssets', () => jest.fn())
jest.mock('../createDatabase', () => jest.fn())
jest.mock('../createPaths', () => jest.fn())

describe('install', () => {
  test('call', () => {
    expect(install).toBeDefined()
  })
})
