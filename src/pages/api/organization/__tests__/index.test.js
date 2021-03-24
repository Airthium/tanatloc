import route from '@/pages/api/organization'

jest.mock('@/route/organization', () => () => {})

describe('pages/api/organization', () => {
  it('call', async () => {
    await route()
  })
})
