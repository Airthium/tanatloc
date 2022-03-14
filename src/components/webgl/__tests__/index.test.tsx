import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import WebGL from '@/pages/webgl'

const mockBack = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    back: () => mockBack()
  })
}))

jest.mock('../fixInfos/noManipBrowser', () => () => <div />)
jest.mock('../fixInfos/firefoxWindows', () => () => <div />)
jest.mock('../fixInfos/firefoxMac', () => () => <div />)
jest.mock('../fixInfos/safariMac', () => () => <div />)

describe('components/webgl', () => {
  beforeEach(() => {
    mockBack.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<WebGL />)

    unmount()
  })

  test('back', () => {
    const { unmount } = render(<WebGL />)

    const button = screen.getByRole('button', {
      name: 'Return to the previous page'
    })
    fireEvent.click(button)
    expect(mockBack).toHaveBeenCalledTimes(1)

    unmount()
  })

  test('modals', () => {
    const { unmount } = render(<WebGL />)

    const buttons = screen.getAllByRole('button')
    buttons.forEach((button) => fireEvent.click(button))
    expect(mockBack).toHaveBeenCalledTimes(1)

    unmount()
  })
})
