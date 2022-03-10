import { ICallError } from '@/api/index.d'

import ErrorNotification from '..'

describe('components/assets/notification/error', () => {
  test('simple', () => {
    ErrorNotification('error', new Error('error'))
  })

  test('with status & info', () => {
    ErrorNotification('error', {
      message: 'error',
      status: 500,
      info: { message: 'API error' }
    } as ICallError)
  })

  test('API error', () => {
    ErrorNotification('error', {
      message: 'Failed to fetch',
      status: 500,
      info: { message: 'API error 1' }
    } as ICallError)

    ErrorNotification('error', {
      message: 'Failed to fetch',
      status: 500,
      info: { message: 'API error 2' }
    } as ICallError)
  })
})
