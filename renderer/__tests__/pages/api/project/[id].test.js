import id from '../../../../pages/api/project/[id]'

jest.mock('../../../../../src/route/project/[id]', () => () => {})

describe('pages/api/project/[id]', () => {
  it('call', async () => {
    await id()
  })
})
