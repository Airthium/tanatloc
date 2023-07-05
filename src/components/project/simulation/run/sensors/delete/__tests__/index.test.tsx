import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'

import Delete, { errors } from '..'

import { IFrontSimulationsItem } from '@/api/index.d'

const mockDeleteButton = jest.fn()
jest.mock('@/components/assets/button', () => ({
  DeleteButton: (props: any) => mockDeleteButton(props)
}))

const mockErrorNotification = jest.fn()
jest.mock('@/context/notification/actions', () => ({
  addError: ({ title, err }: { title: string; err: Error }) =>
    mockErrorNotification(title, err)
}))

const mockSimulationUpdate = jest.fn()
jest.mock('@/api/simulation', () => ({
  update: async () => mockSimulationUpdate()
}))

jest.mock('@/lib/utils', () => ({
  deepCopy: (obj: any) => JSON.parse(JSON.stringify(obj))
}))

describe('components/project/simulation/run/sensors/delete', () => {
  const simulation = {
    id: 'id',
    scheme: {
      configuration: {
        run: {
          sensors: [{}]
        }
      }
    } as IFrontSimulationsItem['scheme']
  }
  const index = 0
  const swr = {
    mutateOneSimulation: jest.fn()
  }

  beforeEach(() => {
    mockDeleteButton.mockReset()
    mockDeleteButton.mockImplementation(() => <div />)

    mockErrorNotification.mockReset()

    mockSimulationUpdate.mockReset()

    swr.mutateOneSimulation.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <Delete simulation={simulation} index={index} swr={swr} />
    )

    unmount()
  })

  test('onDelete', async () => {
    mockDeleteButton.mockImplementation((props) => (
      <div
        role="Delete"
        onClick={async () => {
          try {
            await props.onDelete()
          } catch (err) {}
        }}
      />
    ))
    const { unmount } = render(
      <Delete simulation={simulation} index={index} swr={swr} />
    )

    const del = screen.getByRole('Delete')

    // Normal
    await act(() => fireEvent.click(del))
    await waitFor(() => expect(mockSimulationUpdate).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(swr.mutateOneSimulation).toHaveBeenCalledTimes(1)
    )

    // Error
    mockSimulationUpdate.mockImplementation(() => {
      throw new Error('update error')
    })
    await act(() => fireEvent.click(del))
    await waitFor(() => expect(mockSimulationUpdate).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenCalledWith(
        errors.udpate,
        new Error('update error')
      )
    )

    unmount()
  })
})
