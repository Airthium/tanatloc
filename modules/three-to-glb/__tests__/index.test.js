/**
 * @jest-environment node
 */

const { convert } = require('..')

const mockConvert = jest.fn()
jest.mock('../src', () => ({
  convert: async () => mockConvert()
}))

describe('modules/three-to-glb', () => {
  beforeEach(() => {
    mockConvert.mockReset()
  })

  test('normal', async () => {
    await convert('location', 'name')
    expect(mockConvert).toHaveBeenCalledTimes(1)
  })

  test('error', async () => {
    mockConvert.mockImplementation(() => {
      throw new Error('convert error')
    })
    try {
      await convert('location', 'name')
      expect(true).toBe(false)
    } catch (err) {
      expect(err.message).toBe('convert error')
    } finally {
      expect(mockConvert).toHaveBeenCalledTimes(1)
    }
  })
})
