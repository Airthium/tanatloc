import freefem from '../freefem'

const mockExec = jest.fn()
jest.mock('child_process', () => ({
  exec: async (command, callback) => mockExec(command, callback)
}))

describe('src/services/freefem', () => {
  beforeEach(() => {
    mockExec.mockReset()
  })

  it('freefem', async () => {
    let log

    // Normal
    mockExec.mockImplementation((command, callback) => {
      callback(undefined, 'stdout', 'stderr')
    })
    log = await freefem()
    expect(mockExec).toHaveBeenCalledTimes(1)
    expect(log).toBe('stdout\nstderr')

    // Error
    try {
      mockExec.mockImplementation((command, callback) => {
        callback(new Error())
      })
      log = await freefem()
      expect(true).toBe(false)
    } catch (err) {
      expect(true).toBe(true)
    } finally {
      expect(mockExec).toHaveBeenCalledTimes(2)
    }
  })
})
