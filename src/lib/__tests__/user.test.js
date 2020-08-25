import { getUser } from '../user'
import ErrorBoundary from 'antd/lib/alert/ErrorBoundary'

jest.mock('../../database', () => {
  let count = 0
  return async () => {
    count++
    if (count === 1) throw new Error()
    return {
      rows: [
        {
          email: 'username'
        }
      ]
    }
  }
})

describe('src/lib/user', () => {
  it('getUser - error', async () => {
    const user = await getUser('id')
    expect(user).toBe(undefined)
  })

  it('getUser', async () => {
    const user = await getUser('id')
    expect(user).toEqual({ id: 'id', username: 'username' })
  })
})
