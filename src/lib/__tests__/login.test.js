import login from '../login'

let mockReturn = () => []
jest.mock('../../../database/query/user/login', () => {
  return async () => mockReturn()
})

describe('lib/user', () => {
  it('login', async () => {
    let res

    // Empty list
    res = await login()
    expect(res).toEqual({
      authorized: false,
      id: 0
    })

    // List of size 1
    mockReturn = () => [
      {
        id: 'id'
      }
    ]
    res = await login()
    expect(res).toEqual({
      authorized: true,
      id: 'id'
    })

    // List of size > 1
    mockReturn = () => [
      {
        id: 'id'
      },
      {}
    ]
    res = await login()
    expect(res).toEqual({
      authorized: false,
      id: 0
    })
  })
})
