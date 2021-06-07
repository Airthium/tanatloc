import geometries from '@/pages/api/geometries'

jest.mock('@/route/geometries', () => jest.fn())

describe('pages/api/geometries', () => {
  test('call', async () => {
    await geometries()
  })
})
