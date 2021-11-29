import React from 'react'
import { act, fireEvent, render, screen } from '@testing-library/react'

import Script from '..'

jest.mock('prism-themes/themes/prism-vs.css', () => () => '')

describe('components/editor/information', () => {
  test('render', () => {
    const { unmount } = render(<Script />)

    unmount()
  })

  test('editor', async () => {
    const { unmount } = render(<Script />)

    const editor = screen.getByRole('textbox')
    await act(async () =>
      fireEvent.change(editor, { target: { value: 'some code' } })
    )

    unmount()
  })
})
