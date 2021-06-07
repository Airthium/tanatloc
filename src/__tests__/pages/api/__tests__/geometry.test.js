import geometry from '@/pages/api/geometry'

jest.mock('@/route/geometry', () => jest.fn())

describe('pages/api/geometry', () => {
  test('call', async () => {
    await geometry()
  })
})
