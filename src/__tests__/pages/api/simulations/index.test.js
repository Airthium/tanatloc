import simulations from '../../../../pages/api/simulations'

jest.mock('../../../../../src/route/simulations', () => () => {})

describe('pages/api/simulations', () => {
  it('call', async () => {
    await simulations()
  })
})
