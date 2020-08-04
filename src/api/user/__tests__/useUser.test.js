import useUser from '../useUser'

jest.mock('swr', () => () => ({ data: {}, mutate: jest.fn() }))

describe('src/auth', () => {
  it('useUser', () => {
    useUser()
  })
})
