import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Delete from '@/components/project/simulation/boundaryConditions/delete'

jest.mock('react-redux', () => ({
  useDispatch: () => () => {
    // Empty
  }
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
    id: 'id',
    scheme: {
      category: 'category',
      name: 'name',
      algorithm: 'algorithm',
      code: 'code',
      version: 'version',
      description: 'description',
      configuration: {
        boundaryConditions: {
          index: 3,
          title: 'Boundary conditions',
          firstKey: {
            label: 'label'
          },
          key: {
            label: 'key',
            values: [
              {
                uuid: 'uuid',
                name: 'name',
                type: {
                  key: 'key',
                  label: 'key'
                },
                selected: [{ uuid: 'uuid', label: 1 }]
              },
              {
                uuid: 'uuid',
                name: 'name',
                type: {
                  key: 'key',
                  label: 'key'
                },
                selected: []
              }
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
      <div
        role="DeleteButton"
        onClick={async () => {
          try {
            await props.onDelete()
          } catch (err) {}
        }}
      />
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
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(1))

    unmount()
  })
})
