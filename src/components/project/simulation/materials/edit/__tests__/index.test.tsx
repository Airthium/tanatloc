import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Edit from '@/components/project/simulation/materials/edit'

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

const mockUpdate = jest.fn()
jest.mock('@/api/simulation', () => ({
  update: async () => mockUpdate()
}))

describe('components/project/simulation/materials/edit', () => {
  const material = {
    uuid: 'uuid',
    selected: [
      { uuid: 'uuid1', label: 1 },
      { uuid: 'uuid3', label: 3 }
    ]
  }
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
        materials: {
          index: 3,
          title: 'Materials',
          values: [
            {
              uuid: 'uuid',
              selected: []
            }
          ]
        }
      }
    }
  }
  const geometry = {
    solids: [
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
  })

  test('render', () => {
    const { unmount } = render(
      <Edit
        disabled={false}
        material={material}
        simulation={simulation}
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
        material={material}
        simulation={simulation}
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
})
