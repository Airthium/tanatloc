/**
 * @jest-environment node
 */

import * as config from '../storage'

jest.mock('os', () => ({
  homedir: () => '/homedir'
}))

describe('config/storage', () => {
  test('global', () => {
    if (process.platform === 'win32') {
      expect(config.STORAGE).toBe('\\homedir\\tanatloc')
      expect(config.AVATAR).toBe('\\homedir\\tanatloc\\avatar')
      expect(config.SIMULATION).toBe('\\homedir\\tanatloc\\simulation')
    } else {
      expect(config.STORAGE).toBe('/homedir/tanatloc')
      expect(config.AVATAR).toBe('/homedir/tanatloc/avatar')
      expect(config.SIMULATION).toBe('/homedir/tanatloc/simulation')
    }
  })
})
