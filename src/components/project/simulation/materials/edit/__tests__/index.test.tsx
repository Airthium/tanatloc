import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Edit, { errors } from '@/components/project/simulation/materials/edit'

import { ISimulation } from '@/database/simulation/index'
import { IModelMaterialsValue } from '@/models/index.d'

const mockErrorNotification = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  ErrorNotification: (title: string, err: Error) =>
    mockErrorNotification(title, err)
}))

const mockEditButton = jest.fn()
jest.mock('@/components/assets/button', () => ({
  EditButton: (props: any) => mockEditButton(props)
}))

const mockUpdate = jest.fn()
jest.mock('@/api/simulation', () => ({
  update: async () => mockUpdate()
}))

describe('components/project/simulation/materials/edit', () => {
  const material = {
    uuid: 'uuid',
    material: {},
    selected: [
      { uuid: 'uuid1', label: 1 },
      { uuid: 'uuid3', label: 3 }
    ]
  } as IModelMaterialsValue
  const simulation = {
    id: 'id',
    scheme: {
      configuration: {
        materials: {
          index: 3,
          title: 'Materials',
          values: [
            {
              uuid: 'uuid',
              selected: []
            }
          ]
        }
      }
    }
  } as ISimulation
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
  })

  test('render', () => {
    const { unmount } = render(
      <Edit
        material={material}
        simulation={simulation}
        swr={swr}
        onError={onError}
        onClose={onClose}
      />
    )

    unmount()
  })

  test('onEdit - without material.material', async () => {
    mockEditButton.mockImplementation((props) => (
      <div role="EditButton" onClick={props.onEdit} />
    ))
    const { unmount } = render(
      <Edit
        material={
          {
            uuid: 'uuid',
            selected: [
              { uuid: 'uuid1', label: 1 },
              { uuid: 'uuid3', label: 3 }
            ]
          } as IModelMaterialsValue
        }
        simulation={simulation}
        swr={swr}
        onError={onError}
        onClose={onClose}
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
      expect(onError).toHaveBeenLastCalledWith(errors.material)
    )
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(0))

    unmount()
  })

  test('onEdit - without material.selected', async () => {
    mockEditButton.mockImplementation((props) => (
      <div role="EditButton" onClick={props.onEdit} />
    ))
    const { unmount } = render(
      <Edit
        material={
          {
            uuid: 'uuid',
            material: {
              uuid: 'uuid',
              label: 'label',
              children: []
            },
            geometry: {
              index: 0
            },
            selected: []
          } as IModelMaterialsValue
        }
        simulation={simulation}
        swr={swr}
        onError={onError}
        onClose={onClose}
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

  test('onEdit', async () => {
    mockEditButton.mockImplementation((props) => (
      <div role="EditButton" onClick={props.onEdit} />
    ))
    const { unmount } = render(
      <Edit
        material={material}
        simulation={simulation}
        swr={swr}
        onError={onError}
        onClose={onClose}
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
})
