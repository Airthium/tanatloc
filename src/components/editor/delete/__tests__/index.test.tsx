import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import Delete, { errors } from '..'

const mockErrorNotification = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  ErrorNotification: (title: string, err: Error) =>
    mockErrorNotification(title, err)
}))

const mockDeleteButton = jest.fn()
jest.mock('@/components/assets/button', () => ({
  DeleteButton: (props: any) => mockDeleteButton(props)
}))

const mockUserUpdate = jest.fn()
jest.mock('@/api/user', () => ({
  update: async () => mockUserUpdate()
}))

const mockDeepCopy = jest.fn()
jest.mock('@/lib/utils', () => ({
  deepCopy: (obj: any) => mockDeepCopy(obj)
}))

describe('components/editor/delete', () => {
  const user = { id: 'id', models: [{}, {}], templates: ['', ''] }
  const index = 1
  const swr = {
    mutateUser: jest.fn()
  }

  beforeEach(() => {
    mockErrorNotification.mockReset()

    mockDeleteButton.mockReset()
    mockDeleteButton.mockImplementation(() => <div />)

    mockUserUpdate.mockReset()

    mockDeepCopy.mockReset()

    swr.mutateUser.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Delete user={user} index={index} swr={swr} />)

    unmount()
  })

  test('onDelete', () => {
    mockDeepCopy.mockImplementation((obj) => JSON.parse(JSON.stringify(obj)))
    mockDeleteButton.mockImplementation((props) => (
      <div
        role="DeleteButton"
        onClick={async () => {
          try {
            await props.onDelete(user, index, swr)
          } catch (err) {}
        }}
      />
    ))
    const { unmount } = render(<Delete user={user} index={index} swr={swr} />)

    // Normal
    const button = screen.getByRole('DeleteButton')
    fireEvent.click(button)
    waitFor(() => expect(mockUserUpdate).toHaveBeenCalledTimes(1))
    waitFor(() => expect(swr.mutateUser).toHaveBeenCalledTimes(1))

    // Error
    mockUserUpdate.mockImplementation(() => {
      throw new Error('user update error')
    })
    fireEvent.click(button)
    waitFor(() => expect(mockUserUpdate).toHaveBeenCalledTimes(2))
    waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.delete,
        new Error('user update error')
      )
    )

    unmount()
  })
})
