import Part from '../'

const mockPath = jest.fn()
jest.mock('path', () => ({
  join: () => mockPath()
}))

jest.mock('@/config/storage', () => ({}))

const mockLoadPart = jest.fn(() => 'part')
const mockReadFile = jest.fn(() => 'part')
jest.mock('../../tools', () => ({
  loadPart: async () => mockLoadPart(),
  readFile: async () => mockReadFile()
}))

describe('lib/file', () => {
  test('get', async () => {
    let content

    content = await Part.get(
      { id: 'id' },
      { origin: 'origin', originPath: 'originPath' }
    )
    expect(mockPath).toHaveBeenCalledTimes(1)
    expect(mockLoadPart).toHaveBeenCalledTimes(1)
    expect(mockReadFile).toHaveBeenCalledTimes(0)
    expect(content).toEqual('part')

    content = await Part.get(
      { id: 'id' },
      { partPath: 'path', glb: 'file.glb' }
    )
    expect(mockPath).toHaveBeenCalledTimes(2)
    expect(mockLoadPart).toHaveBeenCalledTimes(1)
    expect(mockReadFile).toHaveBeenCalledTimes(1)
    expect(content).toEqual({ buffer: 'part' })
  })
})
