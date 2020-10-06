import { get } from '../file'

const mockReadFile = jest.fn(() => 'readFile')
jest.mock('../tools', () => ({
  readFile: async () => mockReadFile()
}))

describe('src/lib/file', () => {
  it('get', async () => {
    const content = await get({
      simulation: { id: 'id' },
      file: { origin: 'origin', originPath: 'originPath' }
    })
    expect(content).toEqual({
      buffer: 'readFile'
    })
  })
})
