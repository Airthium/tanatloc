import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Add, { errors } from '..'

const mockPush = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockPush
  })
}))

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
jest.mock('@/api/project', () => ({
  add: async () => mockAdd()
}))

describe('components/project/add', () => {
  const workspace = { id: 'id', projects: [] }
  const swr = {
    mutateOneWorkspace: jest.fn(),
    addOneProject: jest.fn()
  }

  beforeEach(() => {
    mockAddButton.mockReset()
    mockAddButton.mockImplementation(() => <div />)

    mockDialog.mockReset()
    mockDialog.mockImplementation(() => <div />)

    mockErrorNotification.mockReset()

    mockAdd.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Add workspace={workspace} swr={swr} />)

    unmount()
  })

  test('setVisible', () => {
    mockAddButton.mockImplementation((props) => (
      <div role="AddButton" onClick={props.onAdd} />
    ))
    mockDialog.mockImplementation((props) => (
      <div role="Dialog" onClick={props.onCancel} />
    ))
    const { unmount } = render(<Add workspace={workspace} swr={swr} />)

    const button = screen.getByRole('AddButton')
    fireEvent.click(button)

    const dialog = screen.getByRole('Dialog')
    fireEvent.click(dialog)

    unmount()
  })

  test('onAdd', () => {
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
    const { unmount } = render(<Add workspace={workspace} swr={swr} />)

    const dialog = screen.getByRole('Dialog')

    // Normal
    mockAdd.mockImplementation(() => ({}))
    fireEvent.click(dialog)
    waitFor(() => expect(mockAdd).toHaveBeenCalledTimes(1))
    waitFor(() => expect(swr.addOneProject).toHaveBeenCalledTimes(1))
    waitFor(() => expect(swr.mutateOneWorkspace).toHaveBeenCalledTimes(1))
    waitFor(() => expect(mockPush).toHaveBeenCalledTimes(1))

    // Error
    mockAdd.mockImplementation(() => {
      throw new Error('add error')
    })
    fireEvent.click(dialog)
    waitFor(() => expect(mockAdd).toHaveBeenCalledTimes(2))
    waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.add,
        new Error('add error')
      )
    )

    unmount()
  })
})
