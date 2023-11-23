import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'

import Delete, {
  errors
} from '@/components/project/simulation/materials/delete'

import { ISimulation } from '@/database/simulation/index'
import { ISelectState, SelectContext } from '@/context/select'

const mockDeleteButton = jest.fn()
jest.mock('@/components/assets/button', () => ({
  DeleteButton: (props: {}) => mockDeleteButton(props)
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

const contextValue = {
  enabled: true,
  selected: [],
  dispatch: jest.fn()
} as ISelectState

describe('components/project/simulation/materials/delete', () => {
  const simulation = {
    id: 'id',
    scheme: {
      configuration: {
        materials: {
          index: 1,
          title: 'Materials',
          values: [
            {
              uuid: 'uuid',
              material: { label: 'label' },
              selected: [{ uuid: 'uuid', label: 1 }]
            }
          ]
        }
      }
    }
  } as ISimulation
  const swr = { mutateOneSimulation: jest.fn() }
  const index = 0

  beforeEach(() => {
    mockDeleteButton.mockReset()
    mockDeleteButton.mockImplementation(() => <div />)

    mockErrorNotification.mockReset()

    mockSelect.mockReset()

    mockUpdate.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <SelectContext.Provider value={contextValue}>
        <Delete simulation={simulation} swr={swr} index={index} />
      </SelectContext.Provider>
    )

    unmount()
  })

  test('onDelete', async () => {
    mockDeleteButton.mockImplementation((props) => (
      <div
        role="button"
        onClick={async () => {
          try {
            await props.onDelete()
          } catch (err) {}
        }}
      />
    ))
    const { unmount } = render(
      <SelectContext.Provider value={contextValue}>
        <Delete simulation={simulation} swr={swr} index={index} />
      </SelectContext.Provider>
    )

    const button = screen.getByRole('button')

    // Error
    mockUpdate.mockImplementation(() => {
      throw new Error('update error')
    })
    await act(() => fireEvent.click(button))
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(mockErrorNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErrorNotification).toHaveBeenLastCalledWith(
        errors.update,
        new Error('update error')
      )
    )

    // Normal
    mockUpdate.mockImplementation(() => undefined)
    //@ts-ignore
    simulation.scheme.configuration.materials.values = [
      {
        uuid: 'uuid',
        material: { label: 'label', children: [] },
        selected: [{ uuid: 'uuid', label: 1 }]
      }
    ]
    await act(() => fireEvent.click(button))
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(mockSelect).toHaveBeenCalledTimes(2))
    await waitFor(() =>
      expect(swr.mutateOneSimulation).toHaveBeenCalledTimes(1)
    )

    unmount()
  })
})
