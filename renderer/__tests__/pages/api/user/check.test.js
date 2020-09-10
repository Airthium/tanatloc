import user from '../../../../pages/api/user/check'

jest.mock('../../../../../src/route/user/check', () => () => {})

describe('renderer/pages/api/user/check', () => {
  it('call', async () => {
    await user()
  })
})
