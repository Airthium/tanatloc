import avatar from '../../../../pages/api/avatar'

jest.mock('../../../../../src/route/avatar', () => () => {})

describe('pages/api/avatar', () => {
  it('call', async () => {
    await avatar()
  })
})
