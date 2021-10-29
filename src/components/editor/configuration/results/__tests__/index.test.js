import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import Results from '..'

const mockDialog = jest.fn()
jest.mock('@/components/assets/dialog', () => (props) => mockDialog(props))

describe('components/editor/configuration/results', () => {
  const visible = true
  const results = null
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
      <Results
        visible={visible}
        results={results}
        onOk={onOk}
        onClose={onClose}
      />
    )

    unmount()
  })
})
