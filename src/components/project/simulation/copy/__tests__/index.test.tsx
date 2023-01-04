import { fireEvent, screen, render, waitFor } from '@testing-library/react'

import { IFrontSimulationsItem } from '@/api/index.d'

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
  const simulation = {
    id: 'id',
    name: 'name',
    scheme: {
      configuration: {
        run: {
          index: 1,
          title: 'Run'
        }
      }
    }
  } as Pick<IFrontSimulationsItem, 'id' | 'name' | 'scheme'>
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

  test('onCopy', () => {
    const { unmount } = render(
      <Copy project={project} simulation={simulation} swr={swr} />
    )

    const button = screen.getByRole('button')

    // Normal
    mockAdd.mockImplementation(() => ({}))
    fireEvent.click(button)
    waitFor(() => expect(mockAdd).toHaveBeenCalledTimes(1))
    waitFor(() => expect(swr.addOneSimulation).toHaveBeenCalledTimes(1))
    waitFor(() => expect(swr.mutateProject).toHaveBeenCalledTimes(1))

    // Error
    mockAdd.mockImplementation(() => {
      throw new Error('add error')
    })
    fireEvent.click(button)
    waitFor(() => expect(mockAdd).toHaveBeenCalledTimes(2))
    waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.copy,
        new Error('add error')
      )
    )

    unmount()
  })
})
