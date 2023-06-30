import { render } from '@testing-library/react'

import ErrorNotification from '..'

describe('components/assets/notification/error', () => {
  test('simple', () => {
    const { unmount } = render(<ErrorNotification />)

    unmount()
  })

  // test('no display', () => {
  //   ErrorNotification('error', new Error('error'), false)
  // })

  // test('with status & info', () => {
  //   ErrorNotification('error', {
  //     message: 'error',
  //     status: 500,
  //     info: { message: 'API error' }
  //   } as ICallError)
  // })

  // test('API error', () => {
  //   let onClose
  //   jest.spyOn(notification, 'error').mockImplementation((props) => {
  //     onClose = props.onClose
  //   })

  //   ErrorNotification('error', {
  //     message: 'Failed to fetch',
  //     status: 500,
  //     info: { message: 'API error 1' }
  //   } as ICallError)

  //   ErrorNotification('error', {
  //     message: 'Failed to fetch',
  //     status: 500,
  //     info: { message: 'API error 2' }
  //   } as ICallError)

  //   //@ts-ignore
  //   onClose()
  // })

  // test('close all', () => {
  //   ErrorNotification('error', {
  //     message: 'Failed to fetch',
  //     status: 500,
  //     info: { message: 'API error 1' }
  //   } as ICallError)

  //   ErrorNotification('error', {
  //     message: 'Failed to fetch',
  //     status: 500,
  //     info: { message: 'API error 2' }
  //   } as ICallError)

  //   _closeAll()

  //   ErrorNotification('error', {
  //     message: 'Fail',
  //     status: 500,
  //     info: { message: 'error 1' }
  //   } as ICallError)

  //   ErrorNotification('error', {
  //     message: 'Fail',
  //     status: 500,
  //     info: { message: 'error 2' }
  //   } as ICallError)

  //   _closeAll()
  // })
})
