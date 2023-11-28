import { render, screen, fireEvent, waitFor } from '@testing-library/react'

import Local from '..'

describe('plugins/local/src/component', () => {
  const onSelect = jest.fn()

  beforeEach(() => {
    onSelect.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<Local onSelect={onSelect} />)

    unmount()
  })

  test('onClick', () => {
    const { unmount } = render(<Local onSelect={onSelect} />)

    const open = screen.getByRole('button')
    fireEvent.click(open)
    expect(onSelect).toHaveBeenCalledTimes(1)

    unmount()
  })

  test('parallel', async () => {
    const { unmount } = render(<Local parallel={true} onSelect={onSelect} />)

    // Open
    const open = screen.getByRole('button')
    fireEvent.click(open)

    // Close
    const close = screen.getByRole('button', { name: 'Cancel' })
    fireEvent.click(close)

    // Re-open
    fireEvent.click(open)

    // Ok
    const ok = screen.getByRole('button', { name: 'OK' })
    fireEvent.click(ok)

    await waitFor(() => expect(onSelect).toHaveBeenCalledTimes(1))

    unmount()
  })
})
