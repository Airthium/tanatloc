import id from '@/pages/api/groups/[id]'

jest.mock('@/route/groups/[id]', () => () => {})

describe('pages/api/groups/[id]', () => {
  it('call', async () => {
    await id()
  })
})
