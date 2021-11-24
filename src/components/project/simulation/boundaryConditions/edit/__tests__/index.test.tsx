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
      category: 'category',
      name: 'name',
      algorithm: 'algorithm',
      code: 'code',
      version: 'version',
      description: 'description',
      configuration: {
        boundaryConditions: {
          index: 1,
          title: 'Boudnary conditions',
          key: {
            label: 'label',
            values: [
              {
                uuid: 'uuid',
                name: 'name',
                type: {
                  key: 'string',
                  label: 'key'
                },
                selected: []
              }
            ]
          },
          otherKey: {
            label: 'label',
            values: [
              {
                uuid: 'uuid',
                name: 'name',
                type: {
                  key: 'string',
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
  const boundaryCondition = {
    uuid: 'uuid',
    name: 'name',
    type: {
      key: 'key',
      label: 'key'
    },
    selected: [
      { uuid: 'uuid1', label: 1 },
      { uuid: 'uuid3', label: 3 }
    ]
  }
  const oldBoundaryCondition = {
    uuid: 'uuid',
    name: 'name',
    type: {
      key: 'key',
      label: 'key'
    },
    selected: [
      { uuid: 'uuid1', label: 1 },
      { uuid: 'uuid2', label: 2 }
    ]
  }
  const geometry = {
    faces: [
      { uuid: 'uuid1', number: 1 },
      { uuid: 'uuid2', number: 2 }
    ]
  }
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
        geometry={geometry}
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
        geometry={geometry}
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
        geometry={geometry}
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
