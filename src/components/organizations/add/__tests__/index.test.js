import React from 'react'
import {
  fireEvent,
  getByRole,
  render,
  screen,
  waitFor
} from '@testing-library/react'

import Add from '..'

const mockDialog = jest.fn()
jest.mock('@/components/assets/dialog', () => (props) => mockDialog(props))

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

const mockAdd = jest.fn()
jest.mock('@/api/organization', () => ({
  add: async () => mockAdd()
}))

describe('components/organizations/add', () => {
  const swr = {
    addOneOrganization: jest.fn()
  }

  beforeEach(() => {
    mockDialog.mockReset()
    mockDialog.mockImplementation(() => <div />)

    mockError.mockReset()

    mockAdd.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Add swr={swr} />)

    unmount()
  })

  test('setVisible', () => {
    mockDialog.mockImplementation((props) => (
      <div role="Dialog" onClick={props.onCancel} />
    ))
    const { unmount } = render(<Add swr={swr} />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    const dialog = screen.getByRole('Dialog')
    fireEvent.click(dialog)

    unmount()
  })

  test('onAdd', async () => {
    mockDialog.mockImplementation((props) => (
      <div
        role="Dialog"
        onClick={async () => {
          try {
            await props.onOk({})
          } catch (err) {}
        }}
      />
    ))
    const { unmount } = render(<Add swr={swr} />)

    const dialog = screen.getByRole('Dialog')

    // Normal
    mockAdd.mockImplementation(() => ({}))
    fireEvent.click(dialog)
    await waitFor(() => expect(mockAdd).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(swr.addOneOrganization).toHaveBeenCalledTimes(1))

    // Error
    mockAdd.mockImplementation(() => {
      throw new Error()
    })
    fireEvent.click(dialog)
    await waitFor(() => expect(mockAdd).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(1))

    unmount()
  })
})
