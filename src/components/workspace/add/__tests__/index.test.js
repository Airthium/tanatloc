import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Add from '@/components/workspace/add'

const mockDialog = jest.fn()
jest.mock('@/components/assets/dialog', () => (props) => mockDialog(props))

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

const mockAdd = jest.fn()
jest.mock('@/api/workspace', () => ({
  add: async () => mockAdd()
}))

describe('components/workspace/add', () => {
  const visible = true
  const swr = { addOneWorkspace: jest.fn() }
  const setVisible = jest.fn

  beforeEach(() => {
    mockDialog.mockReset()
    mockDialog.mockImplementation(() => <div />)

    mockError.mockReset()

    mockAdd.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <Add visible={visible} swr={swr} setVisible={setVisible} />
    )

    unmount()
  })

  test('onOk', async () => {
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
    const { unmount } = render(
      <Add visible={visible} swr={swr} setVisible={setVisible} />
    )

    const dialog = screen.getByRole('Dialog')

    // Normal
    fireEvent.click(dialog)
    await waitFor(() => expect(mockAdd).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(swr.addOneWorkspace).toHaveBeenCalledTimes(1))

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
