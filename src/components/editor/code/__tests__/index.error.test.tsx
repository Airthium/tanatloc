import { render, screen, waitFor } from '@testing-library/react'

import Code from '..'

jest.mock('../freefem', () => {
  throw new Error('FreeFEM editor error')
})
jest.mock('../json', () => {
  throw new Error('JSON editor error')
})

describe('components/editor/code', () => {
  test('render', () => {
    const { unmount } = render(<Code />)

    waitFor(() => screen.getByText('FreeFEM editor error'))
    waitFor(() => screen.getByText('JSON editor error'))

    unmount()
  })
})
