import { fireEvent, render, screen } from '@testing-library/react'

import ErrorNotification from '..'
import { NotificationContext } from '@/context/notification'

const mockError = jest.fn()
const mockWarning = jest.fn()
const mockDestroy = jest.fn()
jest.mock('antd', () => {
  return {
    ...jest.requireActual('antd'),
    App: {
      useApp: () => ({
        notification: {
          error: mockError,
          warning: mockWarning,
          destroy: mockDestroy
        }
      })
    }
  }
})

describe('components/assets/notification/error', () => {
  const mockDispatch = jest.fn()
  const errors: any = []
  const warnings: any = []

  beforeEach(() => {
    mockError.mockReset()
    mockError.mockImplementation((props) => errors.push(props))
    mockWarning.mockReset()
    mockWarning.mockImplementation((props) => warnings.push(props))
    mockDestroy.mockReset()

    mockDispatch.mockReset()

    errors.lenght = 0
    warnings.lenght = 0
  })

  test('simple', () => {
    const { unmount } = render(<ErrorNotification />)

    unmount()
  })

  test('errors', () => {
    const { unmount } = render(
      <NotificationContext.Provider
        value={{
          errors: [
            { title: 'server1', err: new Error('Failed to fetch') },
            { title: 'server2', err: new Error('Failed to fetch') },
            { title: 'other1', err: new Error('Other') },
            { title: 'other2', err: new Error('Other'), display: false },
            {
              title: 'other3',
              err: {
                ...new Error('Other'),
                status: 400,
                info: { message: 'Info' }
              }
            }
          ],
          dispatch: mockDispatch
        }}
      >
        <ErrorNotification />
      </NotificationContext.Provider>
    )

    expect(errors.length).toBe(3)
    expect(warnings.length).toBe(1)

    errors.forEach((error: any) => {
      error.onClose()
    })

    render(warnings[0].description)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    unmount()
  })
})
