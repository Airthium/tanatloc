import { fireEvent, render, screen } from '@testing-library/react'

import { IFrontSimulationsItem } from '@/api/index.d'

import List from '@/components/project/simulation/boundaryConditions/list'
import { SelectContext } from '@/context/select'

const mockEnable = jest.fn()
const mockDisable = jest.fn()
const mockSelect = jest.fn()
jest.mock('@/context/select/actions', () => ({
  enable: () => mockEnable(),
  disable: () => mockDisable(),
  select: () => mockSelect()
}))

const mockEditButton = jest.fn()
jest.mock('@/components/assets/button', () => ({
  EditButton: (props: {}) => mockEditButton(props)
}))

jest.mock('../../delete', () => () => <div />)

describe('components/project/simulation/boundaryConditions/list', () => {
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
          title: 'Boundary conditions',
          key: {
            label: 'label',
            values: [
              {
                uuid: 'uuid',
                name: 'name',
                type: {
                  key: 'key',
                  label: 'key'
                },
                geometry: {
                  index: 0
                },
                selected: [{ uuid: 'uuid', label: 1 }]
              }
            ]
          }
        }
      }
    }
  }
  const swr = { mutateOneSimulation: jest.fn() }
  const onEdit = jest.fn()

  beforeEach(() => {
    mockEnable.mockReset()
    mockDisable.mockReset()
    mockSelect.mockReset()

    mockEditButton.mockReset()
    mockEditButton.mockImplementation(() => <div />)

    onEdit.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <SelectContext.Provider
        value={{ enabled: true, selected: [], dispatch: jest.fn }}
      >
        <List simulation={simulation} swr={swr} onEdit={onEdit} />
      </SelectContext.Provider>
    )

    unmount()
  })

  test('highlight', () => {
    const { unmount } = render(
      <SelectContext.Provider
        value={{ enabled: true, selected: [], dispatch: jest.fn }}
      >
        <List simulation={simulation} swr={swr} onEdit={onEdit} />
      </SelectContext.Provider>
    )

    const item = screen.getByText('name')
    fireEvent.mouseEnter(item)
    expect(mockEnable).toHaveBeenCalledTimes(1)

    fireEvent.mouseLeave(item)
    expect(mockSelect).toHaveBeenCalledTimes(1)

    unmount()
  })

  test('Edit', () => {
    Object.defineProperty(global, 'setTimeout', {
      value: (callback: Function) => callback()
    })

    mockEditButton.mockImplementation((props) => (
      <div role="EditButton" onClick={props.onEdit} />
    ))
    const { unmount } = render(
      <SelectContext.Provider
        value={{ enabled: true, selected: [], dispatch: jest.fn }}
      >
        <List simulation={simulation} swr={swr} onEdit={onEdit} />
      </SelectContext.Provider>
    )

    const edit = screen.getByRole('EditButton')
    fireEvent.click(edit)

    unmount()
  })
})
