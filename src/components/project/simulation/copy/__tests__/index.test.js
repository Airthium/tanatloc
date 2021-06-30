import React from 'react'
import { fireEvent, screen, render, waitFor } from '@testing-library/react'

import Copy from '..'

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

const mockAdd = jest.fn()
jest.mock('@/api/simulation', () => ({
  add: async () => mockAdd()
}))

describe('components/project/simulation/copy', () => {
  const project = {
    id: 'id',
    simulations: ['id']
  }
  const simulation = {
    id: 'id',
    name: 'name',
    scheme: {
      configuration: {
        run: {}
      }
    }
  }
  const swr = {
    mutateProject: jest.fn(),
    addOneSimulation: jest.fn()
  }

  test('render', () => {
    const { unmount } = render(
      <Copy project={project} simulation={simulation} swr={swr} />
    )

    unmount()
  })

  test('onCopy', async () => {
    const { unmount } = render(
      <Copy project={project} simulation={simulation} swr={swr} />
    )

    const button = screen.getByRole('button')

    // Normal
    mockAdd.mockImplementation(() => ({}))
    fireEvent.click(button)
    await waitFor(() => expect(mockAdd).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(swr.addOneSimulation).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(swr.mutateProject).toHaveBeenCalledTimes(1))

    // Error
    mockAdd.mockImplementation(() => {
      throw new Error()
    })
    fireEvent.click(button)
    await waitFor(() => expect(mockAdd).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(1))

    unmount()
  })
})
