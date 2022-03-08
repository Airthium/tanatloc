import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Delete, { errors } from '@/components/project/simulation/delete'

const mockDeleteButton = jest.fn()
jest.mock('@/components/assets/button', () => ({
  DeleteButton: (props: any) => mockDeleteButton(props)
}))

const mockErrorNotification = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  ErrorNotification: (title: string, err: Error) =>
    mockErrorNotification(title, err)
}))

const mockDel = jest.fn()
jest.mock('@/api/simulation', () => ({
  del: async () => mockDel()
}))

describe('components/project/simulation/delete', () => {
  const project = { id: 'id', simulations: ['id'] }
  const simulation = { id: 'id', name: 'name' }
  const swr = {
    mutateProject: jest.fn(),
    delOneSimulation: jest.fn()
  }
  beforeEach(() => {
    mockDeleteButton.mockReset()
    mockDeleteButton.mockImplementation(() => <div />)

    mockErrorNotification.mockReset()

    mockDel.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <Delete project={project} simulation={simulation} swr={swr} />
    )

    unmount()
  })

  test('onDelete', async () => {
    mockDeleteButton.mockImplementation((props) => (
      <div
        role="DeleteDialog"
        onClick={async () => {
          try {
            await props.onDelete()
          } catch (err) {}
        }}
      />
    ))
    const { unmount } = render(
      <Delete project={project} simulation={simulation} swr={swr} />
    )

    const dialog = screen.getByRole('DeleteDialog')

    // Normal
    fireEvent.click(dialog)
    await waitFor(() => expect(mockDel).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(swr.delOneSimulation).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(swr.mutateProject).toHaveBeenCalledTimes(1))

    // Error
    mockDel.mockImplementation(() => {
      throw new Error('del error')
    })
    fireEvent.click(dialog)
    await waitFor(() => expect(mockDel).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.del,
        new Error('del error')
      )
    )

    unmount()
  })
})
