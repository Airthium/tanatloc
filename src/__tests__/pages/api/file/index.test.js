import avatar from '@/pages/api/file'

jest.mock('@/route/file', () => () => {})

describe('pages/api/file', () => {
  it('call', async () => {
    await avatar()
  })
})
