describe('server', () => {
  test('Server', async () => {
    process.env.port = 0
    require('/server/bin/www.js')
    await new Promise((resolve) => setTimeout(resolve, 1000))
  })
})
