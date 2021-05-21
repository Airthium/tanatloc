import system from '@/pages/api/system'

jest.mock('@/route/system', () => jest.fn())

describe('pages/api/system', () => {
  it('call', async () => {
    await system()
  })
})
