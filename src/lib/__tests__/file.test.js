import { get } from '../file'

const mockPath = jest.fn()
jest.mock('path', () => ({
  join: () => mockPath()
}))

jest.mock('../../../config/storage', () => ({}))

const mockReadFile = jest.fn(() => 'readFile')
jest.mock('../tools', () => ({
  readFile: async () => mockReadFile()
}))

describe('src/lib/file', () => {
  it('get', async () => {
    const content = await get(
      { id: 'id' },
      { origin: 'origin', originPath: 'originPath' }
    )
    expect(mockPath).toHaveBeenCalledTimes(1)
    expect(mockReadFile).toHaveBeenCalledTimes(1)
    expect(content).toEqual({
      buffer: 'readFile'
    })
  })
})
