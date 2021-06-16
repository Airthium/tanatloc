import result from '@/pages/api/result'

jest.mock('@/route/result', () => jest.fn())

describe('pages/api/result', () => {
  test('call', async () => {
    await result()
  })
})
