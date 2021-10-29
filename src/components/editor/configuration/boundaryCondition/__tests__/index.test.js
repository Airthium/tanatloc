import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import BoundaryCondition from '..'

const mockDialog = jest.fn()
jest.mock('@/components/assets/dialog', () => (props) => mockDialog(props))

describe('components/editor/configuration/boundaryCondition', () => {
  const visible = true
  const boundaryCondition = null
  const onOk = jest.fn()
  const onClose = jest.fn()

  beforeEach(() => {
    mockDialog.mockReset()
    mockDialog.mockImplementation(() => <div />)

    onOk.mockReset()
    onClose.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <BoundaryCondition
        visible={visible}
        boundaryCondition={boundaryCondition}
        onOk={onOk}
        onClose={onClose}
      />
    )

    unmount()
  })
})
