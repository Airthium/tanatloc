import groups from '@/pages/api/groups'

jest.mock('@/route/groups', () => jest.fn())

describe('pages/api/groups', () => {
  it('call', async () => {
    await groups()
  })
})
