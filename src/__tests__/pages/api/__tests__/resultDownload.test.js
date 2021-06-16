import result from '@/pages/api/result/download'

jest.mock('@/route/result/download', () => jest.fn())

describe('pages/api/result/download', () => {
  test('call', async () => {
    await result()
  })
})
