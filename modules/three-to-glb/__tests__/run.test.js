jest.mock('path', () => ({
  join: () => 'path'
}))

const mockReadFile = jest.fn()
jest.mock('fs', () => ({
  readFileSync: () => mockReadFile()
}))

describe('modules/three-to-glb/run', () => {
  beforeEach(() => {
    mockReadFile.mockReset()
  })

  it('empty', () => {
    mockReadFile.mockImplementation(() => '{}')
    require('../run')
  })
})
