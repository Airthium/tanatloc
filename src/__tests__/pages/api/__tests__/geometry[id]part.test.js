import part from '@/pages/api/geometry/[id]/part'

jest.mock('@/route/geometry/[id]/part', () => () => {})

describe('pages/api/geometry/[id]/part', () => {
  test('call', async () => {
    await part()
  })
})
