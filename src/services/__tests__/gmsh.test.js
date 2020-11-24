import gmsh from '../gmsh'

const mockExec = jest.fn()
jest.mock('child_process', () => ({
  exec: async (command, callback) => mockExec(command, callback)
}))

describe('src/services/gmsh', () => {
  beforeEach(() => {
    mockExec.mockReset()
  })

  it('gmsh', async () => {
    let log

    // Normal
    mockExec.mockImplementation((command, callback) => {
      callback(undefined, 'stdout', 'stderr')
    })
    log = await gmsh()
    expect(mockExec).toHaveBeenCalledTimes(1)
    expect(log).toBe('stdout\nstderr')

    // Error
    try {
      mockExec.mockImplementation((command, callback) => {
        callback(new Error())
      })
      log = await gmsh()
      expect(true).toBe(false)
    } catch (err) {
      expect(true).toBe(true)
    } finally {
      expect(mockExec).toHaveBeenCalledTimes(2)
    }
  })
})
