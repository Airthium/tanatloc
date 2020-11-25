import gmsh from '../gmsh'

const mockSpawn = jest.fn()
jest.mock('child_process', () => ({
  spawn: () => mockSpawn()
}))

describe('src/services/gmsh', () => {
  beforeEach(() => {
    mockSpawn.mockReset()
  })

  it('gmsh', async () => {
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
    code = await gmsh()
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
      code = await gmsh()
      expect(true).toBe(false)
    } catch (err) {
      expect(true).toBe(true)
    } finally {
      expect(mockSpawn).toHaveBeenCalledTimes(2)
    }
  })
})
