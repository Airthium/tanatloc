import route from '@/pages/api/logout'

// Sentry mock
const mockCaptureException = jest.fn()
jest.mock('@sentry/node', () => ({
  init: jest.fn,
  captureException: (err) => mockCaptureException(err)
}))

describe('e2e/backend/logout', () => {
  const req = {}
  let resStatus
  let resJson
  const res = {
    setHeader: jest.fn,
    status: (code) => {
      resStatus = code
      return {
        json: (object) => {
          resJson = object
        },
        end: () => {
          resJson = 'end'
        }
      }
    }
  }

  beforeEach(() => {
    mockCaptureException.mockReset()

    resStatus = undefined
    resJson = undefined
  })

  test('normal', async () => {
    await route(req, res)
    expect(resStatus).toBe(200)
    expect(resJson).toBe('end')
  })

  test('error', async () => {
    res.setHeader = () => {
      throw new Error('Res error')
    }
    await route(req, res)
    expect(resStatus).toBe(500)
    expect(resJson).toEqual({ error: true, message: 'Res error' })
    expect(mockCaptureException).toHaveBeenLastCalledWith(
      new Error('Res error')
    )
  })
})
