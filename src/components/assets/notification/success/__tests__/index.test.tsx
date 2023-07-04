import { render } from '@testing-library/react'

import Success from '..'
import { NotificationContext } from '@/context/notification'

const mockSuccess = jest.fn()
jest.mock('antd', () => ({
  App: {
    useApp: () => ({
      notification: {
        success: mockSuccess
      }
    })
  }
}))

describe('components/assets/notification/success', () => {
  const mockDispatch = jest.fn()

  test('render', () => {
    const { unmount } = render(<Success />)

    unmount()
  })

  test('with success', () => {
    const { unmount } = render(
      <NotificationContext.Provider
        value={{
          success: [{ title: 'title', description: 'description' }],
          dispatch: mockDispatch
        }}
      >
        <Success />
      </NotificationContext.Provider>
    )

    expect(mockSuccess).toHaveBeenCalledTimes(1)
    expect(mockDispatch).toHaveBeenCalledTimes(1)

    unmount()
  })
})
