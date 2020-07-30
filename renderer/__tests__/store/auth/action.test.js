import { authActionTypes, login, logout } from '../../../store/auth/action'

describe('store/auth/action', () => {
  it('action types', () => {
    expect(authActionTypes.LOGIN).toBeDefined()
    expect(authActionTypes.LOGOUT).toBeDefined()
  })

  it('login', () => {
    const res = login({})
    expect(res).toEqual({
      type: authActionTypes.LOGIN,
      user: {}
    })
  })

  it('logout', () => {
    const res = logout()
    expect(res).toEqual({
      type: authActionTypes.LOGOUT
    })
  })
})
