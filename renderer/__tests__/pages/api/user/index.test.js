import user from '../../../../pages/api/user'

jest.mock('../../../../../src/route/user', () => () => {})

describe('pages/api/user', () => {
  it('call', async () => {
    await user()
  })
})
