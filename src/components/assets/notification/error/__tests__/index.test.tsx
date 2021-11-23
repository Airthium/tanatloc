import Error from '..'

describe('components/assets/notification/error', () => {
  test('simple', () => {
    Error('error', new Error('error'))
  })

  test('with status & info', () => {
    Error('error', {
      ...new Error('error'),
      status: 500,
      info: { message: 'API error' }
    })
  })
})
