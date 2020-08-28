import { login, get, update } from '../user'

const mockUpdate = jest.fn()
jest.mock('../../database/user', () => {
  let count = 0
  return {
    get: async () => ({
      id: 'id',
      username: 'username'
    }),
    getByUsernameAndPassword: async () => {
      count++
      if (count === 1) return
      return { id: 'id' }
    },
    update: async () => mockUpdate()
  }
})

describe('src/lib/user', () => {
  it('get', async () => {
    const user = await get('id')
    expect(user).toEqual({ id: 'id', username: 'username' })
  })

  it('login', async () => {
    let user

    // Empty
    user = await login({ username: 'username' })
    expect(user).toBe(null)

    // Logged
    user = await login({ username: 'username' })
    expect(user).toEqual({ id: 'id', username: 'username' })
  })

  it('update', async () => {
    await update({})
    expect(mockUpdate).toHaveBeenCalledTimes(1)
  })
})
