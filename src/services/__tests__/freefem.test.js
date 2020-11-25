import freefem from '../freefem'

const mockSpawn = jest.fn()
jest.mock('child_process', () => ({
  spawn: () => mockSpawn()
}))

describe('src/services/freefem', () => {
  beforeEach(() => {
    mockSpawn.mockReset()
  })

  it('freefem', async () => {
    let code

    // Normal
    mockSpawn.mockImplementation(() => ({
      stdout: {
        on: (data, callback) => {
          callback('stdout')
        }
      },
      stderr: {
        on: (data, callback) => {
          callback('stderr')
        }
      },
      on: (arg, callback) => {
        if (arg === 'close') callback(0)
      }
    }))
    code = await freefem()
    expect(mockSpawn).toHaveBeenCalledTimes(1)
    expect(code).toBe(0)

    // Error
    try {
      mockSpawn.mockImplementation(() => ({
        stdout: {
          on: () => {}
        },
        stderr: {
          on: () => {}
        },
        on: (arg, callback) => {
          if (arg === 'error') callback('error')
        }
      }))
      code = await freefem()
      expect(true).toBe(false)
    } catch (err) {
      expect(true).toBe(true)
    } finally {
      expect(mockSpawn).toHaveBeenCalledTimes(2)
    }
  })
})
