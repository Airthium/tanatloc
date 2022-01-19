import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import Formula from '@/components/assets/formula'

jest.mock('@/lib/mathjax', () => ({
  mathjaxRefresh: jest.fn
}))

const onValueChange = jest.fn()
const onCheckedChange = jest.fn()

describe('components/assets/formula', () => {
  beforeEach(() => {
    onValueChange.mockReset()
    onCheckedChange.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <Formula defaultValue="value" onValueChange={onValueChange} unit="unit" />
    )

    unmount()
  })

  test('with checkbox', () => {
    const { unmount } = render(
      <Formula
        defaultValue="value"
        defaultChecked={false}
        onValueChange={onValueChange}
        onCheckedChange={onCheckedChange}
      />
    )

    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)

    unmount()
  })

  test('input change', async () => {
    const { unmount } = render(
      <Formula defaultValue="value" onValueChange={onValueChange} />
    )

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'test' } })
    fireEvent.change(input, { target: { value: 'test1' } })

    await waitFor(() => screen.getByRole('img', { name: 'check-circle' }))

    unmount()
  })
})
