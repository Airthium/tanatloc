const { convert } = require('..')

jest.mock('path', () => ({
  join: () => 'path'
}))

const mockExec = jest.fn()
jest.mock('child_process', () => ({
  execSync: () => mockExec()
}))

describe('modules/three-to-glb', () => {
  beforeEach(() => {
    mockExec.mockReset()
  })

  it('convert', () => {
    convert('location', 'name')
    expect(mockExec).toHaveBeenCalledTimes(1)
  })
})
