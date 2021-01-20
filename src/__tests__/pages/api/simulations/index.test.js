import simulations from '@/pages/api/simulations'

jest.mock('@/route/simulations', () => () => {})

describe('pages/api/simulations', () => {
  it('call', async () => {
    await simulations()
  })
})
