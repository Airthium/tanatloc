import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import { IModelBoundaryConditionValue } from '@/models/index.d'
import { IFrontSimulationsItem } from '@/api/index.d'

import Edit, {
  errors
} from '@/components/project/simulation/boundaryConditions/edit'

const mockErrorNotification = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  ErrorNotification: (title: string, err: Error) =>
    mockErrorNotification(title, err)
}))

const mockEditButton = jest.fn()
jest.mock('@/components/assets/button', () => ({
  EditButton: (props: {}) => mockEditButton(props)
}))

const mockUpdate = jest.fn()
jest.mock('@/api/simulation', () => ({
  update: async () => mockUpdate()
}))

describe('components/project/simulation/boundaryConditions/edit', () => {
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
          title: 'Boudnary conditions',
          key: {
            label: 'label',
            values: [
              {
                uuid: 'uuid',
                name: 'name',
                type: {
                  key: 'string',
                  label: 'key'
                },
                selected: []
              }
            ]
          },
          otherKey: {
            label: 'label',
            values: [
              {
                uuid: 'uuid',
                name: 'name',
                type: {
                  key: 'string',
                  label: 'key'
                },
                selected: []
              }
            ]
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
      label: 'key'
    },
    selected: [
      { uuid: 'uuid1', label: 1 },
      { uuid: 'uuid3', label: 3 }
    ]
  }
  const oldBoundaryCondition = {
    uuid: 'uuid',
    name: 'name',
    type: {
      key: 'key',
      label: 'key'
    },
    selected: [
      { uuid: 'uuid1', label: 1 },
      { uuid: 'uuid2', label: 2 }
    ]
  }
  const swr = { mutateOneSimulation: jest.fn() }
  const onClose = jest.fn()
  const onError = jest.fn()

  beforeEach(() => {
    mockErrorNotification.mockReset()

    mockEditButton.mockReset()
    mockEditButton.mockImplementation(() => <div />)

    mockUpdate.mockReset()

    onClose.mockReset()
    onError.mockReset()

    swr.mutateOneSimulation.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <Edit
        simulation={simulation}
        boundaryCondition={boundaryCondition}
        oldBoundaryCondition={oldBoundaryCondition}
        swr={swr}
        onClose={onClose}
        onError={onError}
      />
    )

    unmount()
  })

  test('onEdit', async () => {
    mockEditButton.mockImplementation((props) => (
      <div role="EditButton" onClick={props.onEdit} />
    ))
    const { unmount } = render(
      <Edit
        simulation={simulation}
        boundaryCondition={boundaryCondition}
        oldBoundaryCondition={oldBoundaryCondition}
        swr={swr}
        onClose={onClose}
        onError={onError}
      />
    )

    const button = screen.getByRole('EditButton')

    // Normal
    fireEvent.click(button)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(swr.mutateOneSimulation).toHaveBeenCalledTimes(1)
    )
    await waitFor(() => expect(onError).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(onError).toHaveBeenLastCalledWith())
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1))

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error('update error')
    })
    fireEvent.click(button)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.update,
        new Error('update error')
      )
    )

    unmount()
  })

  test('onEdit - without name', async () => {
    mockEditButton.mockImplementation((props) => (
      <div role="EditButton" onClick={props.onEdit} />
    ))
    const { unmount } = render(
      <Edit
        simulation={simulation}
        boundaryCondition={
          {
            uuid: 'uuid',
            type: {
              key: 'key',
              label: 'key'
            },
            selected: [
              { uuid: 'uuid1', label: 1 },
              { uuid: 'uuid3', label: 3 }
            ]
          } as IModelBoundaryConditionValue
        }
        oldBoundaryCondition={oldBoundaryCondition}
        swr={swr}
        onClose={onClose}
        onError={onError}
      />
    )

    const button = screen.getByRole('EditButton')

    fireEvent.click(button)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(0))
    await waitFor(() =>
      expect(swr.mutateOneSimulation).toHaveBeenCalledTimes(0)
    )
    await waitFor(() => expect(onError).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(onError).toHaveBeenLastCalledWith(errors.name))
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(0))

    unmount()
  })

  test('onEdit - without type', async () => {
    mockEditButton.mockImplementation((props) => (
      <div role="EditButton" onClick={props.onEdit} />
    ))
    const { unmount } = render(
      <Edit
        simulation={simulation}
        boundaryCondition={
          {
            uuid: 'uuid',
            name: 'name',
            selected: [
              { uuid: 'uuid1', label: 1 },
              { uuid: 'uuid3', label: 3 }
            ]
          } as IModelBoundaryConditionValue
        }
        oldBoundaryCondition={oldBoundaryCondition}
        swr={swr}
        onClose={onClose}
        onError={onError}
      />
    )

    const button = screen.getByRole('EditButton')

    fireEvent.click(button)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(0))
    await waitFor(() =>
      expect(swr.mutateOneSimulation).toHaveBeenCalledTimes(0)
    )
    await waitFor(() => expect(onError).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(onError).toHaveBeenLastCalledWith(errors.type))
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(0))

    unmount()
  })

  test('onEdit - without selected', async () => {
    mockEditButton.mockImplementation((props) => (
      <div role="EditButton" onClick={props.onEdit} />
    ))
    const { unmount } = render(
      <Edit
        simulation={simulation}
        boundaryCondition={
          {
            uuid: 'uuid',
            name: 'name',
            type: {
              key: 'key',
              label: 'key'
            }
          } as IModelBoundaryConditionValue
        }
        oldBoundaryCondition={oldBoundaryCondition}
        swr={swr}
        onClose={onClose}
        onError={onError}
      />
    )

    const button = screen.getByRole('EditButton')

    fireEvent.click(button)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(0))
    await waitFor(() =>
      expect(swr.mutateOneSimulation).toHaveBeenCalledTimes(0)
    )
    await waitFor(() => expect(onError).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(onError).toHaveBeenLastCalledWith(errors.selected)
    )
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(0))

    unmount()
  })

  test('onEdit (different old type)', async () => {
    mockEditButton.mockImplementation((props) => (
      <div role="EditButton" onClick={props.onEdit} />
    ))
    oldBoundaryCondition.type.key = 'otherKey'
    const { unmount } = render(
      <Edit
        simulation={simulation}
        boundaryCondition={boundaryCondition}
        oldBoundaryCondition={oldBoundaryCondition}
        swr={swr}
        onClose={onClose}
        onError={onError}
      />
    )

    const button = screen.getByRole('EditButton')
    fireEvent.click(button)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(swr.mutateOneSimulation).toHaveBeenCalledTimes(1)
    )
    await waitFor(() => expect(onError).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1))

    unmount()
  })

  test('onEdit (different old type) - without values', async () => {
    mockEditButton.mockImplementation((props) => (
      <div role="EditButton" onClick={props.onEdit} />
    ))
    oldBoundaryCondition.type.key = 'otherKey'
    //@ts-ignore
    simulation.scheme.configuration.boundaryConditions.key.values = null
    const { unmount } = render(
      <Edit
        simulation={simulation}
        boundaryCondition={boundaryCondition}
        oldBoundaryCondition={oldBoundaryCondition}
        swr={swr}
        onClose={onClose}
        onError={onError}
      />
    )

    const button = screen.getByRole('EditButton')
    fireEvent.click(button)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(swr.mutateOneSimulation).toHaveBeenCalledTimes(1)
    )
    await waitFor(() => expect(onError).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1))

    unmount()
  })
})
