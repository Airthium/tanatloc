/**
 * @jest-environment node
 */

import * as config from '../storage'

jest.mock('os', () => ({
  homedir: () => '/homedir'
}))

describe('config/storage', () => {
  test('global', () => {
    expect(config.STORAGE).toBe('/homedir/tanatloc')
    expect(config.AVATAR).toBe('/homedir/tanatloc/avatar')
    expect(config.SIMULATION).toBe('/homedir/tanatloc/simulation')
  })
})
