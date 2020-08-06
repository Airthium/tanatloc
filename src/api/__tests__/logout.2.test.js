import logout from '../logout'

jest.mock('is-electron', () => () => false)

describe('src/api/logout', () => {
  it('logout', async () => {
    global.fetch = async () => {}
    await logout()
  })
})
