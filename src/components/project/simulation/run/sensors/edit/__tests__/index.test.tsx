import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'

import Edit, { errors } from '..'

import { IFrontSimulationsItem } from '@/api/index.d'

const mockEditButton = jest.fn()
jest.mock('@/components/assets/button', () => ({
  EditButton: (props: any) => mockEditButton(props)
}))

const mockErrorNotification = jest.fn()
jest.mock('@/context/notification/actions', () => ({
  addError: ({ title, err }: { title: string; err: Error }) =>
    mockErrorNotification(title, err)
}))

jest.mock('@/lib/utils', () => ({
  deepCopy: (obj: any) => JSON.parse(JSON.stringify(obj))
}))

const mockSimulationUpdate = jest.fn()
jest.mock('@/api/simulation', () => ({
  update: async () => mockSimulationUpdate()
}))

describe('components/project/simulation/run/sensors/edit', () => {
  const simulation = {
    id: 'id',
    scheme: {
      configuration: {
        run: {
          sensors: [
            {
              name: 'name',
              point: { x: 0, y: 1, z: 2 },
              formula: 'formula'
            }
          ]
        }
      }
    } as IFrontSimulationsItem['scheme']
  }
  const sensor = {
    index: 0,
    name: 'name',
    point: { x: 0, y: 1, z: 2 },
    formula: 'formula'
  }
  const onError = jest.fn()
  const onClose = jest.fn()
  const swr = {
    mutateOneSimulation: jest.fn()
  }

  beforeEach(() => {
    mockEditButton.mockReset()
    mockEditButton.mockImplementation(() => <div />)

    mockErrorNotification.mockReset()

    mockSimulationUpdate.mockReset()

    onError.mockReset()
    onClose.mockReset()
    swr.mutateOneSimulation.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <Edit
        simulation={simulation}
        sensor={sensor}
        onError={onError}
        onClose={onClose}
        swr={swr}
      />
    )

    unmount()
  })

  test('onEdit', async () => {
    mockEditButton.mockImplementation((props) => (
      <div role="Edit" onClick={props.onEdit} />
    ))
    const { unmount } = render(
      <Edit
        simulation={simulation}
        sensor={sensor}
        onError={onError}
        onClose={onClose}
        swr={swr}
      />
    )

    const edit = screen.getByRole('Edit')

    // Normal
    await act(() => fireEvent.click(edit))
    await waitFor(() => expect(mockSimulationUpdate).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(swr.mutateOneSimulation).toHaveBeenCalledTimes(1)
    )
    await waitFor(() => expect(onError).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1))

    // Error
    mockSimulationUpdate.mockImplementation(() => {
      throw new Error('update error')
    })
    await act(() => fireEvent.click(edit))
    await waitFor(() => expect(mockSimulationUpdate).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(onError).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenCalledWith(
        errors.update,
        new Error('update error')
      )
    )

    unmount()
  })

  test('onEdit - no name', () => {
    mockEditButton.mockImplementation((props) => (
      <div role="Edit" onClick={props.onEdit} />
    ))
    const { unmount } = render(
      <Edit
        simulation={simulation}
        sensor={{
          ...sensor,
          //@ts-ignore
          name: undefined
        }}
        onError={onError}
        onClose={onClose}
        swr={swr}
      />
    )

    const edit = screen.getByRole('Edit')
    fireEvent.click(edit)

    expect(onError).toHaveBeenCalledTimes(1)
    expect(onError).toHaveBeenCalledWith(errors.name)

    unmount()
  })

  test('onEdit - no point', () => {
    mockEditButton.mockImplementation((props) => (
      <div role="Edit" onClick={props.onEdit} />
    ))
    const { unmount } = render(
      <Edit
        simulation={simulation}
        sensor={{
          ...sensor,
          //@ts-ignore
          point: undefined
        }}
        onError={onError}
        onClose={onClose}
        swr={swr}
      />
    )

    const edit = screen.getByRole('Edit')
    fireEvent.click(edit)

    expect(onError).toHaveBeenCalledTimes(1)
    expect(onError).toHaveBeenCalledWith(errors.point)

    unmount()
  })

  test('onEdit - no formula', () => {
    mockEditButton.mockImplementation((props) => (
      <div role="Edit" onClick={props.onEdit} />
    ))
    const { unmount } = render(
      <Edit
        simulation={simulation}
        sensor={{
          ...sensor,
          //@ts-ignore
          formula: undefined
        }}
        onError={onError}
        onClose={onClose}
        swr={swr}
      />
    )

    const edit = screen.getByRole('Edit')
    fireEvent.click(edit)

    expect(onError).toHaveBeenCalledTimes(1)
    expect(onError).toHaveBeenCalledWith(errors.formula)

    unmount()
  })
})
