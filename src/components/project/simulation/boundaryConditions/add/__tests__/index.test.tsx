import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Add from '@/components/project/simulation/boundaryConditions/add'

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

const mockUpdate = jest.fn()
jest.mock('@/api/simulation', () => ({
  update: async () => mockUpdate()
}))

describe('components/project/simulation/boundaryConditions/add', () => {
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
          title: 'BOundary conditions',
          key: {
            label: 'key',
            values: []
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
      label: 'type'
    },
    selected: [
      { uuid: 'uuid1', label: 1 },
      { uuid: 'uuid3', label: 1 }
    ]
  }
  const geometry = {
    faces: [
      { uuid: 'uuid1', number: 1 },
      { uuid: 'uuid2', number: 2 }
    ]
  }
  const swr = { mutateOneSimulation: jest.fn() }
  const onClose = jest.fn()
  const onError = jest.fn()

  beforeEach(() => {
    mockError.mockReset()

    mockUpdate.mockReset()

    swr.mutateOneSimulation.mockReset()
    onClose.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <Add
        simulation={simulation}
        boundaryCondition={boundaryCondition}
        geometry={geometry}
        swr={swr}
        onClose={onClose}
        onError={onError}
      />
    )

    unmount()
  })

  test('onAdd', async () => {
    const { unmount } = render(
      <Add
        simulation={simulation}
        boundaryCondition={boundaryCondition}
        geometry={geometry}
        swr={swr}
        onClose={onClose}
        onError={onError}
      />
    )

    const button = screen.getByRole('button')

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

  test('onAdd without values', async () => {
    const { unmount } = render(
      <Add
        simulation={{
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
                title: 'Boundary conditions',
                key: {
                  label: 'key'
                }
              }
            }
          }
        }}
        boundaryCondition={boundaryCondition}
        geometry={geometry}
        swr={swr}
        onClose={onClose}
        onError={onError}
      />
    )

    const button = screen.getByRole('button')
    fireEvent.click(button)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(swr.mutateOneSimulation).toHaveBeenCalledTimes(1)
    )

    unmount()
  })
})
