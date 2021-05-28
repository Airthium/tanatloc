import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import List from '@/components/project/simulation/boundaryConditions/list'

jest.mock('react-redux', () => ({
  useDispatch: () => () => {}
}))

const mockEnable = jest.fn()
const mockDisable = jest.fn()
const mockSelect = jest.fn()
jest.mock('@/store/select/action', () => ({
  enable: () => mockEnable(),
  disable: () => mockDisable(),
  select: () => mockSelect()
}))

jest.mock('@/components/assets/button', () => {
  const EditButton = () => <div />
  return { EditButton }
})

jest.mock('../../delete', () => {
  const Delete = () => <div />
  return Delete
})

describe('components/project/simulation/boundaryConditions/list', () => {
  const simulation = {
    scheme: {
      configuration: {
        boundaryConditions: {
          title: 'title',
          key: {
            values: [
              {
                selected: ['uuid']
              }
            ]
          }
        }
      }
    }
  }
  const mutateOneSimulation = jest.fn()
  const swr = { mutateOneSimulation }
  const onEdit = jest.fn()

  beforeEach(() => {
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

  // test('onHighlight', () => {
  //   wrapper.find('Card').props().onMouseEnter('key', 0)
  //   expect(mockEnable).toHaveBeenCalledTimes(1)
  //   expect(mockSelect).toHaveBeenCalledTimes(1)
  // })

  // test('onUnhighlight', () => {
  //   wrapper.find('Card').props().onMouseLeave()
  //   expect(mockDisable).toHaveBeenCalledTimes(1)
  // })

  // test('edit', () => {
  //   global.setTimeout = (callback) => callback()
  //   wrapper.find('EditButton').props().onEdit()
  //   expect(onEdit).toHaveBeenCalledTimes(1)
  // })

  // test('empty simulation', () => {
  //   wrapper.unmount()
  //   simulation.scheme = {}
  //   wrapper = shallow(
  //     <List simulation={simulation} swr={swr} onEdit={onEdit} />
  //   )
  //   expect(wrapper).toBeDefined()
  // })
})
