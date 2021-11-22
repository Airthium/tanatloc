import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Registration from '..'

jest.mock('@/components/loading', () => ({
  Simple: () => <div />
}))

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Success: () => {},
  Error: () => mockError()
}))

const mockSystem = jest.fn()
const mockMutateSystem = jest.fn()
const mockErrorSystem = jest.fn()
const mockLoadingSystem = jest.fn()
const mockUpdate = jest.fn()
jest.mock('@/api/system', () => ({
  useSystem: () => [
    mockSystem(),
    {
      mutateSystem: mockMutateSystem,
      errorSystem: mockErrorSystem(),
      loadingSystem: mockLoadingSystem()
    }
  ],
  update: async () => mockUpdate()
}))

describe('components/administration/registration', () => {
  beforeEach(() => {
    mockError.mockReset()

    mockSystem.mockReset()
    mockSystem.mockImplementation(() => ({}))
    mockMutateSystem.mockReset()
    mockLoadingSystem.mockReset()
    mockErrorSystem.mockReset()
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
    mockErrorSystem.mockImplementation(() => true)
    const { unmount } = render(<Registration />)

    expect(mockError).toHaveBeenCalledTimes(1)

    unmount()
  })

  test('onAllowSignup', async () => {
    const { unmount } = render(<Registration />)

    const checkboxes = screen.getAllByRole('checkbox')

    // Normal
    fireEvent.click(checkboxes[0])
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(mockMutateSystem).toHaveBeenCalledTimes(1))

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error()
    })
    fireEvent.click(checkboxes[0])
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(1))

    unmount()
  })

  test('onPasswordFinish', async () => {
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

    const button = screen.getByRole('button', { name: 'check' })

    // Normal
    fireEvent.click(button)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(mockMutateSystem).toHaveBeenCalledTimes(1))

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error()
    })
    fireEvent.click(button)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(1))

    unmount()
  })
})
