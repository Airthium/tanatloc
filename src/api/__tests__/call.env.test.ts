Object.defineProperty(process.env, 'PORT', { value: 3001 })

describe('src/api (env)', () => {
  test('call', async () => {
    await import('../call')
  })
})

export {}
