import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import DataBase from '@/components/project/simulation/materials/database'

describe('components/project/simulation/materials/database', () => {
  const mockOnSelect = jest.fn()

  beforeEach(() => {
    mockOnSelect.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<DataBase onSelect={mockOnSelect} />)

    unmount()
  })

  // test('open/close', () => {
  //   expect(wrapper.find('Modal').props().visible).toBe(false)
  //   wrapper.find('Button').props().onClick()
  //   expect(wrapper.find('Modal').props().visible).toBe(true)
  //   wrapper.find('Modal').props().onCancel()
  //   expect(wrapper.find('Modal').props().visible).toBe(false)
  // })

  // test('menu', () => {
  //   wrapper.find('Menu').props().onClick({ key: 'metal' })
  //   expect(wrapper.find('List').length).toBe(1)

  //   wrapper.find('CollapsePanel').props().extra.props.onClick()
  // })
})
