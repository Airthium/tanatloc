import error from '../error'

const mockCaptureException = jest.fn()
jest.mock('@/lib/sentry', () => ({
  captureException: (err) => mockCaptureException(err)
}))

describe('route/error', () => {
  beforeEach(() => {
    mockCaptureException.mockReset()
  })

  test('display', () => {
    const err = error(400, 'Test error')
    expect(err.status).toBe(400)
    expect(err.message).toBe('Test error')
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error('Test error')
    )
  })

  test('no display', () => {
    const err = error(400, 'Test error', false)
    expect(err.status).toBe(400)
    expect(err.message).toBe('Test error')
    expect(mockCaptureException).toHaveBeenCalledTimes(0)
  })
})
