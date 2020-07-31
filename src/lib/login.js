import dBLogin from '../database/query/user/login'

export default async (user) => {
  const response = await dBLogin(user)

  if (response.length === 1) {
    return {
      authorized: true,
      id: response[0].id
    }
  } else {
    return {
      authorized: false,
      id: 0
    }
  }
}
