import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'

import { HPCClientPlugin } from '@/plugins/index.d'

import Delete, { errors } from '..'

const mockDeleteButton = jest.fn()
jest.mock('@/components/assets/button', () => ({
  DeleteButton: (props: any) => mockDeleteButton(props)
}))

const mockErrorNotification = jest.fn()
jest.mock('@/context/notification/actions', () => ({
  addError: ({ title, err }: { title: string; err: Error }) =>
    mockErrorNotification(title, err)
}))

const mockDel = jest.fn()
jest.mock('@/api/plugin', () => ({
  del: (del: any) => mockDel(del)
}))

describe('components/account/hpc/delete', () => {
  const plugin = { uuid: 'uuid', configuration: {} } as HPCClientPlugin
  const swr = {
    delOnePlugin: jest.fn()
  }

  beforeEach(() => {
    mockDeleteButton.mockReset()
    mockDeleteButton.mockImplementation(() => <div role="DeleteButton" />)

    mockErrorNotification.mockReset()

    mockDel.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Delete plugin={plugin} swr={swr} />)

    unmount()
  })

  test('onDelete', async () => {
    mockDeleteButton.mockImplementation((props) => (
      <div
        role="DeleteButton"
        onClick={async () => {
          try {
            await props.onDelete()
          } catch (err) {}
        }}
      />
    ))

    const { unmount } = render(<Delete plugin={plugin} swr={swr} />)

    const button = screen.getByRole('DeleteButton')

    // Error
    mockDel.mockImplementation(() => {
      throw new Error('del error')
    })
    await act(() => fireEvent.click(button))
    await waitFor(() => expect(mockDel).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockDel).toHaveBeenLastCalledWith({ uuid: 'uuid' })
    )
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.del,
        new Error('del error')
      )
    )

    // Normal
    mockDel.mockImplementation(() => {
      // Mock
    })
    await act(() => fireEvent.click(button))
    await waitFor(() => expect(mockDel).toHaveBeenCalledTimes(2))
    await waitFor(() =>
      expect(mockDel).toHaveBeenLastCalledWith({ uuid: 'uuid' })
    )
    await waitFor(() => expect(swr.delOnePlugin).toHaveBeenCalledTimes(1))

    unmount()
  })
})
