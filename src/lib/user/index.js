export default {
  login: async () => {
    await new Promise((resolve) => {
      setTimeout(resolve, 2000)
    })
    return {
      authorized: true,
      id: 'id'
    }
  }
}
