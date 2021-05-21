import route from '@/pages/api/organization'

jest.mock('@/route/organization', () => jest.fn())

describe('pages/api/organization', () => {
  it('call', async () => {
    await route()
  })
})
