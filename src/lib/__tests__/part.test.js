import { get } from '../part'

jest.mock('path', () => ({
  join: () => 'path'
}))

jest.mock('../tools', () => ({
  loadPart: async () => ({})
}))

describe('src/lib/part', () => {
  it('get', async () => {
    const part = await get({ simulation: {}, file: {} })
    expect(part).toEqual({})
  })
})
