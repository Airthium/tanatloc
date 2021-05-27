/**
 * @jest-environment node
 */

import createPaths from '../storage'

const mockMkdir = jest.fn()
jest.mock('fs', () => ({
  promises: {
    mkdir: async () => mockMkdir()
  }
}))

describe('install/storage', () => {
  test('normal', async () => {
    await createPaths()
  })

  test('exists', async () => {
    mockMkdir.mockImplementation(() => {
      const error = new Error()
      error.code = 'EEXIST'
      throw error
    })
    await createPaths()
  })

  test('error', async () => {
    mockMkdir.mockImplementation(() => {
      throw new Error()
    })
    await createPaths()
  })
})
