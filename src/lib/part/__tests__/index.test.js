import Part from '../'

const mockPath = jest.fn()
jest.mock('path', () => ({
  join: () => mockPath()
}))

jest.mock('@/config/storage', () => ({}))

const mockLoadPart = jest.fn(() => 'part')
jest.mock('../../tools', () => ({
  loadPart: async () => mockLoadPart()
}))

describe('lib/file', () => {
  it('get', async () => {
    const content = await Part.get(
      { id: 'id' },
      { origin: 'origin', originPath: 'originPath' }
    )
    expect(mockPath).toHaveBeenCalledTimes(1)
    expect(mockLoadPart).toHaveBeenCalledTimes(1)
    expect(content).toEqual('part')
  })
})
