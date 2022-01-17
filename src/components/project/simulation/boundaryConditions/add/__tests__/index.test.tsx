import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Add from '@/components/project/simulation/boundaryConditions/add'

import { ISimulation } from '@/database/index.d'
import { IModelBoundaryConditionValue } from '@/models/index.d'

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
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
  const simulation = {
    id: 'id',
    scheme: {
      category: 'category',
      name: 'name',
      algorithm: 'algorithm',
      code: 'code',
      version: 'version',
      description: 'description',
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
  } as ISimulation
  const boundaryCondition = {
    uuid: 'uuid',
    name: 'name',
    type: {
      key: 'key',
      label: 'type'
    },
    selected: [
      { uuid: 'uuid1', label: 1 },
      { uuid: 'uuid3', label: 1 }
    ]
  }
  const geometry = {
    faces: [
      { uuid: 'uuid1', number: 1 },
      { uuid: 'uuid2', number: 2 }
    ]
  }
  const swr = { mutateOneSimulation: jest.fn() }
  const onClose = jest.fn()
  const onError = jest.fn()

  beforeEach(() => {
    mockError.mockReset()

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
        geometry={geometry}
        swr={swr}
        onClose={onClose}
        onError={onError}
      />
    )

    unmount()
  })

  test('onAdd', async () => {
    mockAddButton.mockImplementation((props) => (
      <div role="AddButton" onClick={props.onAdd} />
    ))
    const { unmount } = render(
      <Add
        simulation={simulation}
        boundaryCondition={boundaryCondition}
        geometry={geometry}
        swr={swr}
        onClose={onClose}
        onError={onError}
      />
    )

    const button = screen.getByRole('AddButton')

    // Normal
    fireEvent.click(button)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(swr.mutateOneSimulation).toHaveBeenCalledTimes(1)
    )
    await waitFor(() => expect(onError).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1))

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error()
    })
    fireEvent.click(button)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(1))

    unmount()
  })

  test('onAdd - without name', async () => {
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
        geometry={geometry}
        swr={swr}
        onClose={onClose}
        onError={onError}
      />
    )

    const button = screen.getByRole('AddButton')

    fireEvent.click(button)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(0))
    await waitFor(() =>
      expect(swr.mutateOneSimulation).toHaveBeenCalledTimes(0)
    )
    await waitFor(() => expect(onError).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(0))

    unmount()
  })

  test('onAdd - without type', async () => {
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
        geometry={geometry}
        swr={swr}
        onClose={onClose}
        onError={onError}
      />
    )

    const button = screen.getByRole('AddButton')

    fireEvent.click(button)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(0))
    await waitFor(() =>
      expect(swr.mutateOneSimulation).toHaveBeenCalledTimes(0)
    )
    await waitFor(() => expect(onError).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(0))

    unmount()
  })

  test('onAdd - without selected', async () => {
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
        geometry={geometry}
        swr={swr}
        onClose={onClose}
        onError={onError}
      />
    )

    const button = screen.getByRole('AddButton')

    fireEvent.click(button)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(0))
    await waitFor(() =>
      expect(swr.mutateOneSimulation).toHaveBeenCalledTimes(0)
    )
    await waitFor(() => expect(onError).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(0))

    unmount()
  })

  test('onAdd without values', async () => {
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
        geometry={geometry}
        swr={swr}
        onClose={onClose}
        onError={onError}
      />
    )

    const button = screen.getByRole('AddButton')

    fireEvent.click(button)
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(swr.mutateOneSimulation).toHaveBeenCalledTimes(1)
    )

    unmount()
  })
})
