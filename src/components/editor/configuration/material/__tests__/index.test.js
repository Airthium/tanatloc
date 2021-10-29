import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import Material from '..'

const mockDialog = jest.fn()
jest.mock('@/components/assets/dialog', () => (props) => mockDialog(props))

describe('components/editor/configuration/material', () => {
  const visible = true
  const material = null
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
      <Material
        visible={visible}
        material={material}
        onOk={onOk}
        onClose={onClose}
      />
    )

    unmount()
  })

  test('onOk', () => {
    mockDialog.mockImplementation((props) => (
      <div role="Dialog" onClick={props.onOk} />
    ))
    const { unmount } = render(
      <Material
        visible={visible}
        material={material}
        onOk={onOk}
        onClose={onClose}
      />
    )

    const dialog = screen.getByRole('Dialog')
    fireEvent.click(dialog)

    unmount()
  })
})
