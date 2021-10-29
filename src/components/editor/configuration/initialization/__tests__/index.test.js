import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import Initialization from '..'

const mockDialog = jest.fn()
jest.mock('@/components/assets/dialog', () => (props) => mockDialog(props))

describe('components/editor/configuration/initialization', () => {
  const visible = true
  const initialization = null
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
      <Initialization
        visible={visible}
        initialization={initialization}
        onOk={onOk}
        onClose={onClose}
      />
    )

    unmount()
  })
})
