export const authActionTypes = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT'
}

export const login = (user) => {
  return { type: authActionTypes.LOGIN, user: user }
}

export const logout = () => {
  return { type: authActionTypes.LOGOUT }
}
