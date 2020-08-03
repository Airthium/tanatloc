import logout from '../logout'

jest.mock('../call', () => async () => {})

describe('src/api/logout', () => {
  it('logout', async () => {
    await logout()
  })
})
