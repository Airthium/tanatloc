import file from '@/pages/api/file'

jest.mock('@/route/file', () => jest.fn())

describe('pages/api/file', () => {
  it('call', async () => {
    await file()
  })
})
