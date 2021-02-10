import call from '../call'

jest.mock('url-join', () => () => 'url')

const mockFetch = jest.fn()
jest.mock('node-fetch', () => async () => mockFetch())

describe('plugin/rescale/src/lib/call', () => {
  it('json', async () => {
    mockFetch.mockImplementation(() => ({
      headers: {
        get: () => 'application/json'
      },
      json: async () => ({})
    }))
    await call({})
  })

  it('json with next', async () => {
    let count = 0
    mockFetch.mockImplementation(() => {
      count++
      return {
        headers: {
          get: () => 'application/json'
        },
        json: async () => ({
          next: count === 1,
          results: []
        })
      }
    })
    await call({})
  })

  it('text/plain', async () => {
    mockFetch.mockImplementation(() => {
      return {
        headers: {
          get: () => 'text/plain'
        },
        text: async () => 'text'
      }
    })
    await call({})
  })

  it('application/octet-stream', async () => {
    mockFetch.mockImplementation(() => {
      return {
        headers: {
          get: () => 'application/octet-stream'
        },
        text: async () => 'text'
      }
    })
    await call({})
  })

  it('non json', async () => {
    mockFetch.mockImplementation(() => ({
      headers: {
        get: () => 'other'
      }
    }))
    await call({})
  })

  it('error', async () => {
    mockFetch.mockImplementation(() => {
      throw new Error()
    })

    try {
      await call({})
      expect(true).toBe(false)
    } catch (err) {
      expect(true).toBe(true)
    }
  })
})
