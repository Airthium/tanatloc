import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import List from '@/components/project/simulation/materials/list'

import { ISimulation } from '@/database/simulation/index'
import { SelectContext } from '@/context/select'

const mockEditButton = jest.fn()
jest.mock('@/components/assets/button', () => ({
  EditButton: (props: any) => mockEditButton(props)
}))

jest.mock('../../delete', () => () => <div />)

const mockEnable = jest.fn()
const mockDisable = jest.fn()
const mockSelect = jest.fn()
jest.mock('@/context/select/actions', () => ({
  enable: () => mockEnable(),
  disable: () => mockDisable(),
  select: () => mockSelect()
}))

describe('components/project/simulation/materials/list', () => {
  const simulation = {
    id: 'id',
    scheme: {
      configuration: {
        materials: {
          index: 2,
          title: 'title',
          values: [
            {
              uuid: 'uuid',
              selected: [{ uuid: 'uuid', label: 1 }],
              material: { label: 'name', children: [] }
            }
          ]
        }
      }
    }
  } as ISimulation
  const swr = {
    mutateOneSimulation: jest.fn()
  }
  const onEdit = jest.fn()

  beforeEach(() => {
    mockEditButton.mockReset()
    mockEditButton.mockImplementation(() => <div />)

    mockEnable.mockReset()
    mockDisable.mockReset()
    mockSelect.mockReset()

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
