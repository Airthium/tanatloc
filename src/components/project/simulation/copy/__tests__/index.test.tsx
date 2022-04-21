import React from 'react'
import { fireEvent, screen, render, waitFor } from '@testing-library/react'

import { ISimulation } from '@/database/simulation/index'

import Copy, { errors } from '..'

const mockErrorNotification = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  ErrorNotification: (title: string, err: Error) =>
    mockErrorNotification(title, err)
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
  const simulation: ISimulation = {
    id: 'id',
    name: 'name',
    scheme: {
      category: 'category',
      name: 'name',
      description: 'description',
      algorithm: 'algorithm',
      code: 'code',
      version: 'version',
      configuration: {
        run: {
          index: 1,
          title: 'Run'
        }
      }
    }
  }
  const swr = {
    mutateProject: jest.fn(),
    addOneSimulation: jest.fn()
  }

  beforeEach(() => {
    mockAdd.mockReset()

    swr.mutateProject.mockReset()
    swr.addOneSimulation.mockReset()
  })

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

    await new Promise((resolve) => setTimeout(resolve, 100))

    // Error
    mockAdd.mockImplementation(() => {
      throw new Error('add error')
    })
    fireEvent.click(button)
    await waitFor(() => expect(mockAdd).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.copy,
        new Error('add error')
      )
    )

    unmount()
  })

  test('without configuration & without project.simulations', async () => {
    const { unmount } = render(
      <Copy
        project={{
          id: 'id',
          simulations: null
        }}
        simulation={{
          id: 'id',
          name: 'name',
          scheme: {
            category: 'category',
            name: 'name',
            description: 'description',
            algorithm: 'algorithm',
            code: 'code',
            version: 'version',
            configuration: undefined
          }
        }}
        swr={swr}
      />
    )

    const button = screen.getByRole('button')

    // Normal
    mockAdd.mockImplementation(() => ({}))
    fireEvent.click(button)
    await waitFor(() => expect(mockAdd).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(swr.addOneSimulation).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(swr.mutateProject).toHaveBeenCalledTimes(1))

    unmount()
  })
})
