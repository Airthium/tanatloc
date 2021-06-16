import result from '@/pages/api/result/archive'

jest.mock('@/route/result/archive', () => jest.fn())

describe('pages/api/result/archive', () => {
  test('call', async () => {
    await result()
  })
})
