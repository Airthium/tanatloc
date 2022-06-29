import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Add, { errors } from '..'

import { IFrontSimulationsItem } from '@/api/index.d'

const mockAddButton = jest.fn()
jest.mock('@/components/assets/button', () => ({
  AddButton: (props: any) => mockAddButton(props)
}))

const mockErrorNotification = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  ErrorNotification: (text: string, err: Error) =>
    mockErrorNotification(text, err)
}))

jest.mock('@/lib/utils', () => ({
  deepCopy: (obj: any) => JSON.parse(JSON.stringify(obj))
}))

const mockSimulationUpdate = jest.fn()
jest.mock('@/api/simulation', () => ({
  update: async () => mockSimulationUpdate()
}))

describe('components/project/simulation/run/sensors/add', () => {
  const simulation = {
    id: 'id',
    scheme: {
      configuration: { run: {} }
    } as IFrontSimulationsItem['scheme']
  }
  const sensor = {
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
    mockAddButton.mockReset()
    mockAddButton.mockImplementation(() => <div />)

    mockErrorNotification.mockReset()

    mockSimulationUpdate.mockReset()

    onError.mockReset()
    onClose.mockReset()
    swr.mutateOneSimulation.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <Add
        simulation={simulation}
        sensor={sensor}
        onError={onError}
        onClose={onClose}
        swr={swr}
      />
    )

    unmount()
  })

  test('onAdd', async () => {
    mockAddButton.mockImplementation((props) => (
      <div role="Add" onClick={props.onAdd} />
    ))
    const { unmount } = render(
      <Add
        simulation={simulation}
        sensor={sensor}
        onError={onError}
        onClose={onClose}
        swr={swr}
      />
    )

    const add = screen.getByRole('Add')

    // Normal
    fireEvent.click(add)
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
    fireEvent.click(add)
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

  test('onAdd - no name', () => {
    mockAddButton.mockImplementation((props) => (
      <div role="Add" onClick={props.onAdd} />
    ))
    const { unmount } = render(
      <Add
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

    const add = screen.getByRole('Add')
    fireEvent.click(add)

    expect(onError).toHaveBeenCalledTimes(1)
    expect(onError).toHaveBeenCalledWith(errors.name)

    unmount()
  })

  test('onAdd - no point', () => {
    mockAddButton.mockImplementation((props) => (
      <div role="Add" onClick={props.onAdd} />
    ))
    const { unmount } = render(
      <Add
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

    const add = screen.getByRole('Add')
    fireEvent.click(add)

    expect(onError).toHaveBeenCalledTimes(1)
    expect(onError).toHaveBeenCalledWith(errors.point)

    unmount()
  })

  test('onAdd - no formula', () => {
    mockAddButton.mockImplementation((props) => (
      <div role="Add" onClick={props.onAdd} />
    ))
    const { unmount } = render(
      <Add
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

    const add = screen.getByRole('Add')
    fireEvent.click(add)

    expect(onError).toHaveBeenCalledTimes(1)
    expect(onError).toHaveBeenCalledWith(errors.formula)

    unmount()
  })
})
