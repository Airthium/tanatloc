import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Edit from '@/components/project/simulation/boundaryConditions/edit'

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

const mockUpdate = jest.fn()
jest.mock('@/api/simulation', () => ({
  update: async () => mockUpdate()
}))

describe('components/project/simulation/boundaryConditions/edit', () => {
  const simulation = {
    id: 'id',
    scheme: {
      configuration: {
        boundaryConditions: {
          key: {
            values: [{}]
          },
          otherKey: {
            values: [{}]
          }
        }
      }
    }
  }
  const boundaryCondition = {
    uuid: 'uuid',
    type: {
      key: 'key'
    },
    selected: ['uuid1', 'uuid3']
  }
  const oldBoundaryCondition = {
    uuid: 'uuid',
    type: {
      key: 'key'
    },
    selected: ['uuid1', 'uuid2']
  }
  const part = { faces: [{ uuid: 'uuid1' }, { uuid: 'uuid2' }] }
  const swr = { mutateOneSimulation: jest.fn() }
  const close = jest.fn()

  beforeEach(() => {
    mockError.mockReset()

    mockUpdate.mockReset()

    close.mockReset()

    swr.mutateOneSimulation.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <Edit
        disabled={false}
        simulation={simulation}
        boundaryCondition={boundaryCondition}
        oldBoundaryCondition={oldBoundaryCondition}
        part={part}
        swr={swr}
        close={close}
      />
    )

    unmount()
  })

  test('onEdit', async () => {
    const { unmount } = render(
      <Edit
        disabled={false}
        simulation={simulation}
        boundaryCondition={boundaryCondition}
        oldBoundaryCondition={oldBoundaryCondition}
        part={part}
        swr={swr}
        close={close}
      />
    )

    const button = screen.getByRole('button')

    // Normal
    fireEvent.click(button)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(swr.mutateOneSimulation).toHaveBeenCalledTimes(1)
    )
    await waitFor(() => expect(close).toHaveBeenCalledTimes(1))

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error()
    })
    fireEvent.click(button)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(1))

    unmount()
  })

  test('onEdit (different old type)', async () => {
    oldBoundaryCondition.type.key = 'otherKey'
    const { unmount } = render(
      <Edit
        disabled={false}
        simulation={simulation}
        boundaryCondition={boundaryCondition}
        oldBoundaryCondition={oldBoundaryCondition}
        part={part}
        swr={swr}
        close={close}
      />
    )

    const button = screen.getByRole('button')
    fireEvent.click(button)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(swr.mutateOneSimulation).toHaveBeenCalledTimes(1)
    )
    await waitFor(() => expect(close).toHaveBeenCalledTimes(1))

    unmount()
  })
})
