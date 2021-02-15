import part from '@/pages/api/part'

jest.mock('@/route/part', () => () => {})

describe('pages/api/part', () => {
  it('call', async () => {
    await part()
  })
})
