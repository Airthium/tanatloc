/**
 * @jest-environment node
 */

import main from '..'

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
  test('call', async () => {
    await main()
  })
})
