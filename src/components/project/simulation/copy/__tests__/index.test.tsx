import { fireEvent, screen, render, waitFor, act } from '@testing-library/react'

import { IFrontSimulationsItem } from '@/api/index.d'

import Copy, { errors } from '..'

const mockErrorNotification = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  ErrorNotification: (title: string, err: Error) =>
    mockErrorNotification(title, err)
}))

const mockCopy = jest.fn()
jest.mock('@/api/simulation', () => ({
  copy: async () => mockCopy()
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
    mockCopy.mockReset()

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
    mockCopy.mockImplementation(() => ({}))
    await act(() => fireEvent.click(button))
    await waitFor(() => expect(mockCopy).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(swr.addOneSimulation).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(swr.mutateProject).toHaveBeenCalledTimes(1))

    // Error
    mockCopy.mockImplementation(() => {
      throw new Error('copy error')
    })
    await act(() => fireEvent.click(button))
    await waitFor(() => expect(mockCopy).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.copy,
        new Error('copy error')
      )
    )

    unmount()
  })
})
