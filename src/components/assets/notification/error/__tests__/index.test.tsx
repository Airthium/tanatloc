import ErrorNotification from '..'

describe('components/assets/notification/error', () => {
  test('simple', () => {
    ErrorNotification('error', new Error('error'))
  })

  test('with status & info', () => {
    ErrorNotification('error', {
      ...new Error('error'),
      status: 500,
      info: { message: 'API error' }
    })
  })

  test('API error', () => {
    ErrorNotification('error', {
      ...new Error('Filaed to fetch'),
      status: 500,
      info: { message: 'API error' }
    })
  })
})
