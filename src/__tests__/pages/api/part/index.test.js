import avatar from '../../../../pages/api/part'

jest.mock('../../../../../src/route/part', () => () => {})

describe('pages/api/part', () => {
  it('call', async () => {
    await avatar()
  })
})
