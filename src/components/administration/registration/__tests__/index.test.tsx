import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Registration, { errors } from '..'

jest.mock('@/components/loading', () => ({
  Simple: () => <div />
}))

const mockSuccessNotification = jest.fn()
const mockErrorNotification = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  SuccessNotification: () => mockSuccessNotification(),
  ErrorNotification: (title: string, err: Error) =>
    mockErrorNotification(title, err)
}))

const mockSystem = jest.fn()
const mockMutateSystem = jest.fn()
const mockErrorNotificationSystem = jest.fn()
const mockLoadingSystem = jest.fn()
const mockUpdate = jest.fn()
jest.mock('@/api/system', () => ({
  useSystem: () => [
    mockSystem(),
    {
      mutateSystem: mockMutateSystem,
      errorSystem: mockErrorNotificationSystem(),
      loadingSystem: mockLoadingSystem()
    }
  ],
  update: async () => mockUpdate()
}))

describe('components/administration/registration', () => {
  beforeEach(() => {
    mockSuccessNotification.mockReset()
    mockErrorNotification.mockReset()

    mockSystem.mockReset()
    mockSystem.mockImplementation(() => ({}))
    mockMutateSystem.mockReset()
    mockLoadingSystem.mockReset()
    mockErrorNotificationSystem.mockReset()
    mockUpdate.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Registration />)

    unmount()
  })

  test('loading', () => {
    mockLoadingSystem.mockImplementation(() => true)
    const { unmount } = render(<Registration />)

    unmount()
  })

  test('error', () => {
    mockErrorNotificationSystem.mockImplementation(() => true)
    const { unmount } = render(<Registration />)

    expect(mockErrorNotification).toHaveBeenCalledTimes(1)
    expect(mockErrorNotification).toHaveBeenLastCalledWith(errors.system, true)

    unmount()
  })

  test('onAllowSignup', () => {
    const { unmount } = render(<Registration />)

    const checkboxes = screen.getAllByRole('checkbox')

    // Normal
    fireEvent.click(checkboxes[0])
    waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))
    waitFor(() => expect(mockMutateSystem).toHaveBeenCalledTimes(1))
    waitFor(() => expect(mockSuccessNotification).toHaveBeenCalledTimes(1))

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error('update error')
    })
    fireEvent.click(checkboxes[0])
    waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(2))
    waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.update,
        new Error('update error')
      )
    )

    unmount()
  })

  test('onPasswordFinish', () => {
    const { unmount } = render(<Registration />)

    // Fill form
    const min = screen.getByRole('spinbutton', {
      name: 'Minimum number of characters'
    })
    const max = screen.getByRole('spinbutton', {
      name: 'Maximum number of characters'
    })

    fireEvent.change(min, { target: { value: 8 } })
    fireEvent.change(max, { target: { value: 16 } })

    const button = screen.getByRole('button', { name: 'check Save changes' })

    // Normal
    fireEvent.click(button)
    waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))
    waitFor(() => expect(mockMutateSystem).toHaveBeenCalledTimes(1))
    waitFor(() => expect(mockSuccessNotification).toHaveBeenCalledTimes(1))

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error('update error')
    })
    fireEvent.click(button)
    waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(2))
    waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.update,
        new Error('update error')
      )
    )

    unmount()
  })
})
