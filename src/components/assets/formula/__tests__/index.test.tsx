import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'

import Formula from '@/components/assets/formula'

jest.mock('@/components/assets/mathjax', () => ({
  Inline: () => <div />,
  Formula: () => <div />,
  Html: () => <div />
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
      <Formula
        onValueChange={onValueChange}
        units={[{ label: 'unit', multiplicator: 1 }]}
        unit={{ label: 'unit', multiplicator: 1 }}
      />
    )

    unmount()
  })

  test('render with label', () => {
    const { unmount } = render(
      <Formula
        label="test"
        defaultValue="value"
        onValueChange={onValueChange}
        units={[{ label: 'unit', multiplicator: 1 }]}
        unit={{ label: 'unit', multiplicator: 1 }}
      />
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
    await act(() => fireEvent.change(input, { target: { value: 'test' } }))
    await act(() => fireEvent.change(input, { target: { value: 'test1' } }))

    await waitFor(() => screen.getByRole('img', { name: 'check-circle' }))

    unmount()
  })
})
