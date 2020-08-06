import logout from '../logout'

jest.mock('is-electron', () => () => true)

describe('src/api/logout', () => {
  it('logout', async () => {
    global.fetch = async () => {}
    await logout()
  })
})
