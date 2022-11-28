import { render, screen, fireEvent } from '@testing-library/react'

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
    fireEvent.click(screen.getByRole('button'))
    expect(onSelect).toHaveBeenCalledTimes(1)

    unmount()
  })
})
