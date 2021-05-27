import logout from '../logout'

jest.mock('is-electron', () => () => false)

describe('api/logout', () => {
  test('logout', async () => {
    global.fetch = async () => {}
    await logout()
  })
})
