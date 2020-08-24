import user from '../../../../pages/api/user'

let mockSession = () => ({})
jest.mock('../../../../../src/auth/iron', () => ({
  getSession: () => mockSession()
}))

jest.mock('../../../../../src/database/user', () => ({
  getById: async () => ({
    email: 'email',
    firstname: 'firstname',
    lastname: 'lastname'
  })
}))

describe('pages/api/user', () => {
  const req = {}
  let response
  const res = {
    status: () => ({
      json: (obj) => {
        response = obj
      }
    })
  }

  it('no session', async () => {
    await user(req, res)
    expect(response).toEqual({ message: 'Unauthorized' })
  })

  it('session', async () => {
    mockSession = () => ({ id: 'id' })
    await user(req, res)
    expect(response).toEqual({
      user: {
        email: 'email',
        firstname: 'firstname',
        lastname: 'lastname'
      }
    })
  })
})
