import Error from '..'

describe('components/assets/notification/error', () => {
  test('simple', () => {
    Error('error', { message: 'error' })
  })

  test('with status & info', () => {
    Error('error', {
      message: 'error',
      status: 500,
      info: { message: 'API error' }
    })
  })
})
