import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Add from '@/components/project/simulation/materials/add'

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

const mockUpdate = jest.fn()
jest.mock('@/api/simulation', () => ({
  update: async () => mockUpdate()
}))

describe('components/project/simulation/materials/add', () => {
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
          index: 1,
          title: 'Materials'
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
  const swr = {
    mutateOneSimulation: jest.fn()
  }
  const close = jest.fn()

  beforeEach(() => {
    mockError.mockReset()

    mockUpdate.mockReset()

    swr.mutateOneSimulation.mockReset()
    close.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <Add
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

  test('onAdd', async () => {
    const { unmount } = render(
      <Add
        disabled={false}
        material={material}
        simulation={simulation}
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
        disabled={false}
        material={material}
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
              materials: {
                index: 1,
                title: 'Materials'
              }
            }
          }
        }}
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
