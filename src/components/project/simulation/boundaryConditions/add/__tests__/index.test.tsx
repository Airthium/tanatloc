import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Add, {
  errors
} from '@/components/project/simulation/boundaryConditions/add'

import { IFrontSimulationsItem } from '@/api/index.d'

import { IModelBoundaryConditionValue } from '@/models/index.d'

jest.mock('uuid', () => ({
  v4: () => 'uuid'
}))

const mockErrorNotification = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  ErrorNotification: (title: string, err: Error) =>
    mockErrorNotification(title, err)
}))

const mockAddButton = jest.fn()
jest.mock('@/components/assets/button', () => ({
  AddButton: (props: {}) => mockAddButton(props)
}))

const mockUpdate = jest.fn()
jest.mock('@/api/simulation', () => ({
  update: async () => mockUpdate()
}))

describe('components/project/simulation/boundaryConditions/add', () => {
  const simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'> = {
    id: 'id',
    scheme: {
      category: 'category',
      name: 'name',
      algorithm: 'algorithm',
      code: 'code',
      version: 'version',
      description: 'description',
      //@ts-ignore
      configuration: {
        boundaryConditions: {
          index: 1,
          title: 'BOundary conditions',
          key: {
            label: 'key',
            values: []
          }
        }
      }
    }
  }
  const boundaryCondition = {
    uuid: 'uuid',
    name: 'name',
    type: {
      key: 'key',
      label: 'type'
    },
    geometry: 'id',
    selected: [
      { uuid: 'uuid1', label: 1 },
      { uuid: 'uuid3', label: 1 }
    ]
  }
  const swr = { mutateOneSimulation: jest.fn() }
  const onClose = jest.fn()
  const onError = jest.fn()

  beforeEach(() => {
    mockErrorNotification.mockReset()

    mockAddButton.mockReset()
    mockAddButton.mockImplementation(() => <div />)

    mockUpdate.mockReset()

    swr.mutateOneSimulation.mockReset()
    onClose.mockReset()
    onError.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <Add
        simulation={simulation}
        boundaryCondition={boundaryCondition}
        swr={swr}
        onClose={onClose}
        onError={onError}
      />
    )

    unmount()
  })

  test('onAdd', () => {
    mockAddButton.mockImplementation((props) => (
      <div role="AddButton" onClick={props.onAdd} />
    ))
    const { unmount } = render(
      <Add
        simulation={simulation}
        boundaryCondition={boundaryCondition}
        swr={swr}
        onClose={onClose}
        onError={onError}
      />
    )

    const button = screen.getByRole('AddButton')

    // Normal
    fireEvent.click(button)
    waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(2))
    waitFor(() => expect(swr.mutateOneSimulation).toHaveBeenCalledTimes(1))
    waitFor(() => expect(onError).toHaveBeenCalledTimes(1))
    waitFor(() => expect(onError).toHaveBeenLastCalledWith())
    waitFor(() => expect(onClose).toHaveBeenCalledTimes(1))

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error('update error')
    })
    fireEvent.click(button)
    waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(3))
    waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.update,
        new Error('update error')
      )
    )

    unmount()
  })

  test('onAdd - without name', () => {
    mockAddButton.mockImplementation((props) => (
      <div role="AddButton" onClick={props.onAdd} />
    ))
    const { unmount } = render(
      <Add
        simulation={simulation}
        boundaryCondition={
          {
            uuid: 'uuid',
            type: {
              key: 'key',
              label: 'type'
            },
            selected: [
              { uuid: 'uuid1', label: 1 },
              { uuid: 'uuid3', label: 1 }
            ]
          } as IModelBoundaryConditionValue
        }
        swr={swr}
        onClose={onClose}
        onError={onError}
      />
    )

    const button = screen.getByRole('AddButton')

    fireEvent.click(button)
    waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(0))
    waitFor(() => expect(swr.mutateOneSimulation).toHaveBeenCalledTimes(0))
    waitFor(() => expect(onError).toHaveBeenCalledTimes(1))
    waitFor(() => expect(onError).toHaveBeenLastCalledWith(errors.name))
    waitFor(() => expect(onClose).toHaveBeenCalledTimes(0))

    unmount()
  })

  test('onAdd - without type', () => {
    mockAddButton.mockImplementation((props) => (
      <div role="AddButton" onClick={props.onAdd} />
    ))
    const { unmount } = render(
      <Add
        simulation={simulation}
        boundaryCondition={
          {
            uuid: 'uuid',
            name: 'name',
            selected: [
              { uuid: 'uuid1', label: 1 },
              { uuid: 'uuid3', label: 1 }
            ]
          } as IModelBoundaryConditionValue
        }
        swr={swr}
        onClose={onClose}
        onError={onError}
      />
    )

    const button = screen.getByRole('AddButton')

    fireEvent.click(button)
    waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(0))
    waitFor(() => expect(swr.mutateOneSimulation).toHaveBeenCalledTimes(0))
    waitFor(() => expect(onError).toHaveBeenCalledTimes(1))
    waitFor(() => expect(onError).toHaveBeenLastCalledWith(errors.type))
    waitFor(() => expect(onClose).toHaveBeenCalledTimes(0))

    unmount()
  })

  test('onAdd - without selected', () => {
    mockAddButton.mockImplementation((props) => (
      <div role="AddButton" onClick={props.onAdd} />
    ))
    const { unmount } = render(
      <Add
        simulation={simulation}
        boundaryCondition={
          {
            uuid: 'uuid',
            name: 'name',
            type: {
              key: 'key',
              label: 'type'
            }
          } as IModelBoundaryConditionValue
        }
        swr={swr}
        onClose={onClose}
        onError={onError}
      />
    )

    const button = screen.getByRole('AddButton')

    fireEvent.click(button)
    waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(0))
    waitFor(() => expect(swr.mutateOneSimulation).toHaveBeenCalledTimes(0))
    waitFor(() => expect(onError).toHaveBeenCalledTimes(1))
    waitFor(() => expect(onError).toHaveBeenLastCalledWith(errors.selected))
    waitFor(() => expect(onClose).toHaveBeenCalledTimes(0))

    unmount()
  })

  test('onAdd without values', () => {
    mockAddButton.mockImplementation((props) => (
      <div role="AddButton" onClick={props.onAdd} />
    ))
    const { unmount } = render(
      <Add
        simulation={{
          id: 'id',
          scheme: {
            category: 'category',
            name: 'name',
            algorithm: 'algorithm',
            code: 'code',
            version: 'version',
            description: 'description',
            //@ts-ignore
            configuration: {
              boundaryConditions: {
                index: 1,
                title: 'Boundary conditions',
                key: {
                  label: 'key'
                }
              }
            }
          }
        }}
        boundaryCondition={boundaryCondition}
        swr={swr}
        onClose={onClose}
        onError={onError}
      />
    )

    const button = screen.getByRole('AddButton')

    fireEvent.click(button)
    waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))
    waitFor(() => expect(swr.mutateOneSimulation).toHaveBeenCalledTimes(1))

    unmount()
  })
})
