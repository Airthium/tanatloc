import id from '@/pages/api/geometry/[id]'

jest.mock('@/route/geometry/[id]', () => jest.fn())

describe('pages/api/geometry/[id]', () => {
  test('call', async () => {
    await id()
  })
})
