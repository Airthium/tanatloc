import Rescale from '..'

const mockCall = jest.fn()
jest.mock('../call', () => async () => mockCall())

describe('plugin/rescale/src/lib', () => {
  it('init', async () => {
    // Normal
    mockCall.mockImplementation(() => ({ results: [{}] }))
    const res = await Rescale.init({
      platform: {},
      token: {}
    })
    expect(mockCall).toHaveBeenCalledTimes(2)

    // Invalid token
    mockCall.mockImplementation(() => ({ detail: 'Invalid token.' }))
    try {
      await Rescale.init({
        platform: {},
        token: {}
      })
      expect(true).toBe(false)
    } catch (err) {
      expect(true).toBe(true)
    }
  })
})
