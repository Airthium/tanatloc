import createPaths from '../storage'

let mockMkdir = () => {}
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
    mockMkdir = () => {
      throw { code: 'EEXIST' }
    }
    await createPaths()
  })

  it('error', async () => {
    mockMkdir = () => {
      throw new Error()
    }
    await createPaths()
  })
})
