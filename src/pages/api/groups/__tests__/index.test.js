import groups from '@/pages/api/groups'

jest.mock('@/route/groups', () => () => {})

describe('pages/api/groups', () => {
  it('call', async () => {
    await groups()
  })
})
