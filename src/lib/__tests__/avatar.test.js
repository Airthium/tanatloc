import { read } from '../avatar'

jest.mock('fs', () => {
  let count = 0
  return {
    promises: {
      readFile: async () => {
        count++
        if (count === 1) throw new Error()
        return { toString: () => 'avatar' }
      }
    }
  }
})

jest.mock('../../database', () => async () => ({
  rows: [
    {
      path: 'path'
    }
  ]
}))

describe('src/lib/avatar', () => {
  it('read - error', async () => {
    const avatar = await read('id')
    expect(avatar).toBe(undefined)
  })

  it('read', async () => {
    const avatar = await read('id')
    expect(avatar).toBe('avatar')
  })
})
