import { readAvatar } from '../avatar'

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
  it('readAvatar - error', async () => {
    const avatar = await readAvatar('id')
    expect(avatar).toBe(undefined)
  })

  it('readAvatar', async () => {
    const avatar = await readAvatar('id')
    expect(avatar).toBe('avatar')
  })
})
