import { fireEvent, screen, render, waitFor, act } from '@testing-library/react'

import Edit, { errors } from '..'

const mockEditButton = jest.fn()
jest.mock('@/components/assets/button', () => ({
  EditButton: (props: any) => mockEditButton(props)
}))

const mockErrorNotification = jest.fn()
jest.mock('@/context/notification/actions', () => ({
  addError: ({ title, err }: { title: string; err: Error }) =>
    mockErrorNotification(title, err)
}))

const mockDialog = jest.fn()
jest.mock('@/components/assets/dialog', () => (props: any) => mockDialog(props))

const mockUpdate = jest.fn()
jest.mock('@/api/simulation', () => ({
  update: async () => mockUpdate()
}))

describe('components/project/simulation/about/edit', () => {
  const simulation = {
    id: 'id',
    name: 'name'
  }
  const swr = {
    mutateOneSimulation: jest.fn()
  }

  beforeEach(() => {
    mockErrorNotification.mockReset()

    mockDialog.mockReset()
    mockDialog.mockImplementation(() => <div />)

    mockEditButton.mockReset()
    mockEditButton.mockImplementation(() => <div />)

    mockUpdate.mockReset()

    swr.mutateOneSimulation.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Edit simulation={simulation} swr={swr} />)

    unmount()
  })

  test('onEdit', async () => {
    mockEditButton.mockImplementation((props) => (
      <div role="EditButton" onClick={props.onEdit} />
    ))
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
    const { unmount } = render(<Edit simulation={simulation} swr={swr} />)

    // Set visible
    const editButton = screen.getByRole('EditButton')
    await act(() => fireEvent.click(editButton))

    const dialog = screen.getByRole('Dialog')

    // Normal
    await act(() => fireEvent.click(dialog))
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(swr.mutateOneSimulation).toHaveBeenCalledTimes(1)
    )

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error('update error')
    })
    await act(() => fireEvent.click(dialog))
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(2))
    await waitFor(() =>
      expect(swr.mutateOneSimulation).toHaveBeenCalledTimes(1)
    )
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.update,
        new Error('update error')
      )
    )

    unmount()
  })

  test('Cancel', () => {
    mockDialog.mockImplementation((props) => (
      <div role="Dialog" onClick={props.onCancel} />
    ))
    const { unmount } = render(<Edit simulation={simulation} swr={swr} />)

    const dialog = screen.getByRole('Dialog')
    fireEvent.click(dialog)

    unmount()
  })
})
