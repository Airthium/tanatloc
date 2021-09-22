/**
 * @jest-environment node
 */

import install from '../'

jest.mock('is-electron', () => () => false)

jest.mock('../copyAssets', () => jest.fn())
jest.mock('../createDatabase', () => jest.fn())
jest.mock('../createPaths', () => jest.fn())

describe('install', () => {
  test('call', () => {
    expect(install).toBeDefined()
  })
})
