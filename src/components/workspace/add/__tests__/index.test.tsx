import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'

import Add, { errors } from '@/components/workspace/add'

const mockAddButton = jest.fn()
jest.mock('@/components/assets/button', () => ({
  AddButton: (props: any) => mockAddButton(props)
}))

const mockDialog = jest.fn()
jest.mock('@/components/assets/dialog', () => (props: any) => mockDialog(props))

const mockErrorNotification = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  ErrorNotification: (title: string, err: Error) =>
    mockErrorNotification(title, err)
}))

const mockAdd = jest.fn()
jest.mock('@/api/workspace', () => ({
  add: async () => mockAdd()
}))

describe('components/workspace/add', () => {
  const swr = { addOneWorkspace: jest.fn() }

  beforeEach(() => {
    mockDialog.mockReset()
    mockDialog.mockImplementation(() => <div />)

    mockErrorNotification.mockReset()

    mockAddButton.mockReset()
    mockAddButton.mockImplementation(() => <div />)

    mockAdd.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Add swr={swr} />)

    unmount()
  })

  test('onCancel', () => {
    mockAddButton.mockImplementation((props) => (
      <div role="AddButton" onClick={props.onAdd} />
    ))
    mockDialog.mockImplementation((props) => (
      <div role="Dialog" onClick={props.onCancel} />
    ))
    const { unmount } = render(<Add swr={swr} />)

    // visible
    const addButton = screen.getByRole('AddButton')
    fireEvent.click(addButton)

    // cancel
    const dialog = screen.getByRole('Dialog')
    fireEvent.click(dialog)

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
    const { unmount } = render(<Add swr={swr} />)

    const dialog = screen.getByRole('Dialog')

    // Normal
    fireEvent.click(dialog)
    await act(async () =>
      waitFor(() => expect(mockAdd).toHaveBeenCalledTimes(1))
    )
    await waitFor(() => expect(swr.addOneWorkspace).toHaveBeenCalledTimes(1))

    // Error
    mockAdd.mockImplementation(() => {
      throw new Error('add error')
    })
    fireEvent.click(dialog)
    await act(async () =>
      waitFor(() => expect(mockAdd).toHaveBeenCalledTimes(2))
    )
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.add,
        new Error('add error')
      )
    )

    unmount()
  })
})
