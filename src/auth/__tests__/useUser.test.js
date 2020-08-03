import { fetcher, useUser } from '../useUser'

jest.mock('swr', () => () => ({ data: {}, mutate: jest.fn() }))

describe('src/auth', () => {
  it('fetcher', () => {
    global.fetch = async () => ({
      json: jest.fn()
    })
    fetcher()
  })

  it('useUser', () => {
    useUser()
  })
})
