import part from '@/pages/api/part'

jest.mock('@/route/part', () => jest.fn())

describe('pages/api/part', () => {
  it('call', async () => {
    await part()
  })
})
