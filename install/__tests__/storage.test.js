import createPaths from '../storage'

const mockMkdir = jest.fn()
jest.mock('fs', () => ({
  promises: {
    mkdir: async () => mockMkdir()
  }
}))

describe('install/storage', () => {
  it('normal', async () => {
    await createPaths()
  })

  it('exists', async () => {
    mockMkdir.mockImplementation(() => {
      const error = new Error()
      error.code = 'EEXIST'
      throw error
    })
    await createPaths()
  })

  it('error', async () => {
    mockMkdir.mockImplementation(() => {
      throw new Error()
    })
    await createPaths()
  })
})
