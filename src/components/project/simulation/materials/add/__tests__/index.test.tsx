import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Add from '@/components/project/simulation/materials/add'

import { ISimulation } from '@/database/index.d'
import { IModelMaterialValue } from '@/models/index.d'

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

describe('components/project/simulation/materials/add', () => {
  const material = {
    material: {},
    selected: [
      { uuid: 'uuid1', label: 1 },
      { uuid: 'uuid3', label: 3 }
    ]
  } as IModelMaterialValue
  const simulation = {
    id: 'id',
    scheme: {
      configuration: {
        materials: {
          index: 1,
          title: 'Materials'
        }
      }
    }
  } as ISimulation
  const geometry = {
    solids: [
      { uuid: 'uuid1', number: 1 },
      { uuid: 'uuid2', number: 2 }
    ]
  }
  const swr = {
    mutateOneSimulation: jest.fn()
  }
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
        material={material}
        simulation={simulation}
        geometry={geometry}
        swr={swr}
        onError={onError}
        onClose={onClose}
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
        material={material}
        simulation={simulation}
        geometry={geometry}
        swr={swr}
        onError={onError}
        onClose={onClose}
      />
    )

    const button = screen.getByRole('AddButton')
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

  test('onAdd - without material.material', async () => {
    mockAddButton.mockImplementation((props) => (
      <div role="AddButton" onClick={props.onAdd} />
    ))
    const { unmount } = render(
      <Add
        material={{
          selected: [
            { uuid: 'uuid1', label: 1 },
            { uuid: 'uuid3', label: 3 }
          ]
        }}
        simulation={simulation}
        geometry={geometry}
        swr={swr}
        onError={onError}
        onClose={onClose}
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

  test('onAdd - without material.selected', async () => {
    mockAddButton.mockImplementation((props) => (
      <div role="AddButton" onClick={props.onAdd} />
    ))
    const { unmount } = render(
      <Add
        material={
          {
            material: {}
          } as IModelMaterialValue
        }
        simulation={simulation}
        geometry={geometry}
        swr={swr}
        onError={onError}
        onClose={onClose}
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
        material={material}
        simulation={
          {
            id: 'id',
            scheme: {
              configuration: {
                materials: {
                  index: 1,
                  title: 'Materials'
                }
              }
            }
          } as ISimulation
        }
        geometry={geometry}
        swr={swr}
        onError={onError}
        onClose={onClose}
      />
    )

    const button = screen.getByRole('AddButton')
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
