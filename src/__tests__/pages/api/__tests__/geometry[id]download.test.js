import download from '@/pages/api/geometry/[id]/download'

jest.mock('@/route/geometry/[id]/download', () => () => {})

describe('pages/api/geometry/[id]/download', () => {
  test('call', async () => {
    await download()
  })
})
