import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Delete, {
  errors
} from '@/components/project/simulation/materials/delete'

import { ISimulation } from '@/database/index.d'

const mockDeleteButton = jest.fn()
jest.mock('@/components/assets/button', () => ({
  DeleteButton: (props: {}) => mockDeleteButton(props)
}))

const mockErrorNotification = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  ErrorNotification: (title: string, err: Error) =>
    mockErrorNotification(title, err)
}))

jest.mock('react-redux', () => ({
  useDispatch: () => () => {
    // Empty
  }
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
          index: 1,
          title: 'Materials',
          values: [
            {
              uuid: 'uuid',
              selected: [{ uuid: 'uuid', label: 1 }]
            }
          ]
        }
      }
    }
  } as ISimulation
  const swr = { mutateOneSimulation: jest.fn() }
  const index = 0

  beforeEach(() => {
    mockDeleteButton.mockReset()
    mockDeleteButton.mockImplementation(() => <div />)

    mockErrorNotification.mockReset()

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
      <div
        role="button"
        onClick={async () => {
          try {
            await props.onDelete()
          } catch (err) {}
        }}
      />
    ))
    const { unmount } = render(
      <Delete simulation={simulation} swr={swr} index={index} />
    )

    const button = screen.getByRole('button')

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error('update error')
    })
    fireEvent.click(button)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.update,
        new Error('update error')
      )
    )

    // Normal
    mockUpdate.mockImplementation(() => {
      // Empty
    })
    simulation.scheme.configuration.materials.values = [
      {
        uuid: 'uuid',
        selected: [{ uuid: 'uuid', label: 1 }]
      }
    ]
    fireEvent.click(button)
    await waitFor(() => expect(mockUnselect).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(2))
    await waitFor(() =>
      expect(swr.mutateOneSimulation).toHaveBeenCalledTimes(1)
    )

    unmount()
  })
})
