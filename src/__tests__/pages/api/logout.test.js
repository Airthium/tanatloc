import logout from '../../../pages/api/logout'

jest.mock('../../../../src/route/logout', () => () => {})

describe('pages/api/logout', () => {
  it('call', async () => {
    await logout()
  })
})
