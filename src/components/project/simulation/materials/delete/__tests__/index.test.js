import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Delete from '@/components/project/simulation/materials/delete'

const mockDeleteButton = jest.fn()
jest.mock('@/components/assets/button', () => ({
  DeleteButton: (props) => mockDeleteButton(props)
}))

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

jest.mock('react-redux', () => ({
  useDispatch: () => () => {}
}))

const mockUnselect = jest.fn()
jest.mock('@/store/select/action', () => ({
  unselect: () => mockUnselect()
}))

const mockUpdate = jest.fn()
jest.mock('@/api/simulation', () => ({
  update: async () => mockUpdate()
}))

describe('components/project/simulation/materials/delete', () => {
  const simulation = {
    id: 'id',
    scheme: {
      configuration: {
        materials: {
          values: [
            {
              selected: ['uuid']
            }
          ]
        }
      }
    }
  }
  const swr = { mutateOneSimulation: jest.fn() }
  const index = 0

  beforeEach(() => {
    mockDeleteButton.mockReset()
    mockDeleteButton.mockImplementation(() => <div />)

    mockError.mockReset()

    mockUnselect.mockReset()

    mockUpdate.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <Delete simulation={simulation} swr={swr} index={index} />
    )

    unmount()
  })

  test('onDelete', async () => {
    mockDeleteButton.mockImplementation((props) => (
      <div role="button" onClick={props.onDelete} />
    ))
    const { unmount } = render(
      <Delete simulation={simulation} swr={swr} index={index} />
    )

    const button = screen.getByRole('button')

    // Normal
    fireEvent.click(button)
    await waitFor(() => expect(mockUnselect).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(swr.mutateOneSimulation).toHaveBeenCalledTimes(1)
    )

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error()
    })
    fireEvent.click(button)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(1))

    unmount()
  })
})
