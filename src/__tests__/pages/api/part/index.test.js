import avatar from '@/pages/api/part'

jest.mock('@/route/part', () => () => {})

describe('pages/api/part', () => {
  it('call', async () => {
    await avatar()
  })
})
