import id from '../../../../pages/api/simulations/[ids]'

jest.mock('../../../../../src/route/simulations/[ids]', () => () => {})

describe('pages/api/simulations/[id]', () => {
  it('call', async () => {
    await id()
  })
})
