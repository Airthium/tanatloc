import system from '@/pages/api/system'

jest.mock('@/route/system', () => jest.fn())

describe('pages/api/system', () => {
  test('call', async () => {
    await system()
  })
})
