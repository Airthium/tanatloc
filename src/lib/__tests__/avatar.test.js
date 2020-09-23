import { read } from '../avatar'

jest.mock('fs', () => ({
  promises: {
    readFile: async () => 'avatar'
  }
}))

jest.mock('../../database/avatar', () => ({
  get: async () => ({
    path: 'path'
  })
}))

describe('src/lib/avatar', () => {
  it('read', async () => {
    const avatar = await read('id')
    expect(avatar).toBe('avatar')
  })
})
