import avatar from '../../../../pages/api/file'

jest.mock('../../../../../src/route/file', () => () => {})

describe('pages/api/file', () => {
  it('call', async () => {
    await avatar()
  })
})
