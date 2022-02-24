import { logout } from '../logout'

jest.mock('is-electron', () => () => false)

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
