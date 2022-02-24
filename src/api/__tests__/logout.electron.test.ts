import { logout } from '../logout'

jest.mock('is-electron', () => () => true)

describe('api/logout', () => {
  test('logout', async () => {
    Object.defineProperty(global, 'fetch', {
      value: async () => {
        // Empty
      }
    })
    await logout()
  })
})
