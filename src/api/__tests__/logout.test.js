import logout from '../logout'

jest.mock('is-electron', () => () => false)

describe('api/logout', () => {
  it('logout', async () => {
    global.fetch = async () => {}
    await logout()
  })
})
