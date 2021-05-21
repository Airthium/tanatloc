import simulations from '@/pages/api/simulations'

jest.mock('@/route/simulations', () => jest.fn())

describe('pages/api/simulations', () => {
  it('call', async () => {
    await simulations()
  })
})
