import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Delete from '@/components/project/simulation/boundaryConditions/delete'

jest.mock('react-redux', () => ({
  useDispatch: () => () => {}
}))

const mockDeleteButton = jest.fn()
jest.mock('@/components/assets/button', () => ({
  DeleteButton: (props) => mockDeleteButton(props)
}))

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

const mockUnselect = jest.fn()
jest.mock('@/store/select/action', () => ({
  unselect: () => mockUnselect()
}))

const mockUpdate = jest.fn()
jest.mock('@/api/simulation', () => ({
  update: async () => mockUpdate()
}))

describe('components/project/simulation/boundaryConditions/delete', () => {
  const simulation = {
    scheme: {
      configuration: {
        boundaryConditions: {
          index: 3,
          firstKey: {},
          key: {
            values: [
              {
                selected: ['uuid']
              },
              {}
            ]
          }
        }
      }
    }
  }
  const type = 'key'
  const index = 0
  const mutateOneSimulation = jest.fn()
  const swr = {
    mutateOneSimulation
  }

  beforeEach(() => {
    mockDeleteButton.mockReset()
    mockDeleteButton.mockImplementation(() => <div role="DeleteButton" />)

    mockError.mockReset()

    mockUnselect.mockReset()

    mockUpdate.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <Delete simulation={simulation} type={type} index={index} swr={swr} />
    )

    unmount()
  })

  test('onDelete', async () => {
    mockDeleteButton.mockImplementation((props) => (
      <div role="DeleteButton" onClick={props.onDelete} />
    ))
    const { unmount } = render(
      <Delete simulation={simulation} type={type} index={index} swr={swr} />
    )

    const button = screen.getByRole('DeleteButton')

    // Normal
    fireEvent.click(button)
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
