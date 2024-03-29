import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'

import { IFrontSimulationsItem } from '@/api/index.d'

import Delete, {
  errors
} from '@/components/project/simulation/boundaryConditions/delete'
import { SelectContext } from '@/context/select'

const mockDeleteButton = jest.fn()
jest.mock('@/components/assets/button', () => ({
  DeleteButton: (props: any) => mockDeleteButton(props)
}))

const mockErrorNotification = jest.fn()
jest.mock('@/context/notification/actions', () => ({
  addError: ({ title, err }: { title: string; err: Error }) =>
    mockErrorNotification(title, err)
}))

const mockSelect = jest.fn()
jest.mock('@/context/select/actions', () => ({
  select: () => mockSelect()
}))

const mockUpdate = jest.fn()
jest.mock('@/api/simulation', () => ({
  update: async () => mockUpdate()
}))

const contextValue = { enabled: true, selected: [], dispatch: jest.fn }

describe('components/project/simulation/boundaryConditions/delete', () => {
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
          index: 3,
          title: 'Boundary conditions',
          firstKey: {
            label: 'label'
          },
          key: {
            label: 'key',
            values: [
              {
                uuid: 'uuid',
                name: 'name',
                type: {
                  key: 'key',
                  label: 'key'
                },
                geometry: 'id',
                selected: [{ uuid: 'uuid', label: 1 }]
              },
              {
                uuid: 'uuid',
                name: 'name',
                type: {
                  key: 'key',
                  label: 'key'
                },
                geometry: 'id',
                selected: []
              }
            ]
          }
        }
      }
    }
  }
  const type = 'key'
  const index = 0
  const mutateOneSimulation = jest.fn()
  const swr = {
    mutateOneSimulation
  }

  beforeEach(() => {
    mockDeleteButton.mockReset()
    mockDeleteButton.mockImplementation(() => <div role="DeleteButton" />)

    mockErrorNotification.mockReset()

    mockSelect.mockReset()

    mockUpdate.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <SelectContext.Provider value={contextValue}>
        <Delete simulation={simulation} type={type} index={index} swr={swr} />
      </SelectContext.Provider>
    )

    unmount()
  })

  test('onDelete', async () => {
    mockDeleteButton.mockImplementation((props) => (
      <div
        role="DeleteButton"
        onClick={async () => {
          try {
            await props.onDelete()
          } catch (err) {}
        }}
      />
    ))
    const { unmount } = render(
      <SelectContext.Provider value={contextValue}>
        <Delete simulation={simulation} type={type} index={index} swr={swr} />
      </SelectContext.Provider>
    )

    const button = screen.getByRole('DeleteButton')

    // Normal
    await act(() => fireEvent.click(button))
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(swr.mutateOneSimulation).toHaveBeenCalledTimes(1)
    )

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error('update error')
    })
    await act(() => fireEvent.click(button))
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
