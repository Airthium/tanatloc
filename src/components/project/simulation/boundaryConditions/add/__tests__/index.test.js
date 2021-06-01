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
    scheme: {
      configuration: {
        boundaryConditions: {
          key: {
            values: []
          }
        }
      }
    }
  }
  const boundaryCondition = {
    type: {
      key: 'key'
    },
    selected: ['uuid1', 'uuid3']
  }
  const part = { faces: [{ uuid: 'uuid1' }, { uuid: 'uuid2' }] }
  const swr = { mutateOneSimulation: jest.fn() }
  const close = jest.fn()

  beforeEach(() => {
    mockError.mockReset()

    mockUpdate.mockReset()

    close.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <Add
        disabled={false}
        simulation={simulation}
        boundaryCondition={boundaryCondition}
        part={part}
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
        simulation={simulation}
        boundaryCondition={boundaryCondition}
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
