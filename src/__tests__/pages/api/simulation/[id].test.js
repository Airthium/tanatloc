import id from '../../../../pages/api/simulation/[id]'

jest.mock('../../../../../src/route/simulation/[id]', () => () => {})

describe('pages/api/simulation/[id]', () => {
  it('call', async () => {
    await id()
  })
})
