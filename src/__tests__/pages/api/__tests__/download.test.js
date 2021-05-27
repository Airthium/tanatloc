import download from '@/pages/api/download'

jest.mock('@/route/download', () => jest.fn())

describe('pages/api/download', () => {
  test('call', async () => {
    await download()
  })
})
