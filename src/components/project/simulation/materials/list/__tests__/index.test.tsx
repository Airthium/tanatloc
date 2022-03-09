import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import List from '@/components/project/simulation/materials/list'

import { ISimulation } from '@/database/index.d'

const mockEditButton = jest.fn()
jest.mock('@/components/assets/button', () => ({
  EditButton: (props: any) => mockEditButton(props)
}))

jest.mock('../../delete', () => () => <div />)

jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn()
}))

const mockEnable = jest.fn()
const mockDisable = jest.fn()
const mockSelect = jest.fn()
jest.mock('@/store/select/action', () => ({
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
      <List simulation={simulation} swr={swr} onEdit={onEdit} />
    )

    unmount()
  })

  test('highlight', () => {
    const { unmount } = render(
      <List simulation={simulation} swr={swr} onEdit={onEdit} />
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
      <List simulation={simulation} swr={swr} onEdit={onEdit} />
    )

    const edit = screen.getByRole('EditButton')
    fireEvent.click(edit)

    unmount()
  })
})
