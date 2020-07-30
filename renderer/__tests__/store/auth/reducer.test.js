import reducer, { authInitialState } from '../../../store/auth/reducer'

jest.mock('../../../store/auth/action', () => ({
  authActionTypes: {
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT'
  }
}))

describe('store/auth/reducer', () => {
  it('initial state', () => {
    expect(authInitialState.user).toEqual({})
  })

  it('no state', () => {
    const res = reducer(undefined, {})
    expect(res).toEqual({
      user: {}
    })
  })

  it('login', () => {
    const res = reducer({}, { type: 'LOGIN', user: { id: 'id' } })
    expect(res).toEqual({
      user: { id: 'id' }
    })
  })

  it('logout', () => {
    const res = reducer({}, { type: 'LOGOUT' })
    expect(res).toEqual({
      user: {}
    })
  })
})
