import part from '@/pages/api/part'

jest.mock('@/route/part', () => jest.fn())

describe('pages/api/part', () => {
  test('call', async () => {
    await part()
  })
})
