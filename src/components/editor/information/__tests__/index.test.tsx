import React from 'react'
import { act, fireEvent, render, screen } from '@testing-library/react'

import Information from '..'

describe('components/editor/information', () => {
  const configuration = {}
  const onNext = jest.fn()

  beforeEach(() => {
    onNext.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <Information configuration={configuration} onNext={onNext} />
    )

    unmount()
  })

  test('add category', async () => {
    const { unmount } = render(
      <Information configuration={configuration} onNext={onNext} />
    )

    // Open select
    const select = screen.getByRole('combobox')
    await act(async () => {
      fireEvent.mouseDown(select)
    })

    const input = screen.getAllByRole('textbox')[2]
    fireEvent.change(input, { target: { value: 'New category' } })

    const button = screen.getByRole('img')
    await act(async () => {
      fireEvent.click(button)
    })

    unmount()
  })
})
