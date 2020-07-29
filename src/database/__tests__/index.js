import query from '..'

jest.mock('pg', () => {
  return {
    Pool: class PoolMock {
      constructor() {
        this.connect = async () => {
          throw new Error()
        }
        this.query = async () => 'query'
        this.end = jest.fn()
      }
    }
  }
})

jest.mock('../../../config/db', () => {
  return {}
})

describe('database', () => {
  it('query', async () => {
    const res = await query()
    expect(res).toBe('query')
  })
})
