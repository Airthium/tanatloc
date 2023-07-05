import { render } from '@testing-library/react'
import NotificationProvider, { initialState, notificationReducer } from '..'

describe('context/notification', () => {
  const error = {
    title: 'title',
    err: new Error('error')
  }
  const success = {
    title: 'title',
    description: 'description'
  }

  test('render', () => {
    const { unmount } = render(
      <NotificationProvider>Children</NotificationProvider>
    )

    unmount()
  })

  test('reducer', () => {
    const state = initialState
    state.dispatch({ type: 'type', value: error })

    let newState

    newState = notificationReducer(state, {
      type: 'REMOVESUCCESS',
      value: success
    })
    expect(newState.success).toEqual(undefined)

    newState = notificationReducer(state, {
      type: 'ADDSUCCESS',
      value: success
    })
    expect(newState.success).toEqual([success])

    newState = notificationReducer(newState, {
      type: 'REMOVESUCCESS',
      value: success
    })
    expect(newState.success).toEqual([])
    newState = notificationReducer(newState, {
      type: 'REMOVESUCCESS',
      value: success
    })
    expect(newState.success).toEqual([])

    newState = notificationReducer(state, {
      type: 'REMOVEERROR',
      value: error
    })
    expect(newState.errors).toEqual(undefined)

    newState = notificationReducer(state, { type: 'ADDERROR', value: error })
    expect(newState.errors).toEqual([error])

    newState = notificationReducer(newState, {
      type: 'REMOVEERROR',
      value: error
    })
    expect(newState.errors).toEqual([])
    newState = notificationReducer(newState, {
      type: 'REMOVEERROR',
      value: error
    })
    expect(newState.errors).toEqual([])

    newState = notificationReducer(state, {
      type: 'OTHER',
      value: error
    })
    expect(newState).toEqual(state)
  })
})
