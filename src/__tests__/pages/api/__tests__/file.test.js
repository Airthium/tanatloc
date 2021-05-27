import file from '@/pages/api/file'

jest.mock('@/route/file', () => jest.fn())

describe('pages/api/file', () => {
  test('call', async () => {
    await file()
  })
})
