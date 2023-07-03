import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'

import Add, { errors } from '@/components/project/simulation/materials/add'

import { ISimulation } from '@/database/simulation/index'
import { IModelMaterialsValue } from '@/models/index.d'

jest.mock('uuid', () => ({
  v4: () => 'uuid'
}))

const mockErrorNotification = jest.fn()
jest.mock('@/context/notification/actions', () => ({
  addError: ({ title, err }: { title: string; err: Error }) =>
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

describe('components/project/simulation/materials/add', () => {
  const material = {
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
          index: 1,
          title: 'Materials'
        }
      }
    }
  } as ISimulation
  const swr = {
    mutateOneSimulation: jest.fn()
  }
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
        material={material}
        simulation={simulation}
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
        swr={swr}
        onError={onError}
        onClose={onClose}
      />
    )

    const button = screen.getByRole('AddButton')
    await act(() => fireEvent.click(button))
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(2))
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
    await act(() => fireEvent.click(button))
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(3))
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.update,
        new Error('update error')
      )
    )

    unmount()
  })

  test('onAdd - without material.material', async () => {
    mockAddButton.mockImplementation((props) => (
      <div role="AddButton" onClick={props.onAdd} />
    ))
    const { unmount } = render(
      <Add
        material={
          {
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

    const button = screen.getByRole('AddButton')
    await act(() => fireEvent.click(button))
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

  test('onAdd - without material.selected', async () => {
    mockAddButton.mockImplementation((props) => (
      <div role="AddButton" onClick={props.onAdd} />
    ))
    const { unmount } = render(
      <Add
        material={
          {
            material: {}
          } as IModelMaterialsValue
        }
        simulation={simulation}
        swr={swr}
        onError={onError}
        onClose={onClose}
      />
    )

    const button = screen.getByRole('AddButton')
    await act(() => fireEvent.click(button))
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
        swr={swr}
        onError={onError}
        onClose={onClose}
      />
    )

    const button = screen.getByRole('AddButton')
    await act(() => fireEvent.click(button))
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(2))
    await waitFor(() =>
      expect(swr.mutateOneSimulation).toHaveBeenCalledTimes(1)
    )
    await waitFor(() => expect(onError).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1))

    unmount()
  })
})
