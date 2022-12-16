import { fireEvent, render, screen } from '@testing-library/react'

import Sensors from '..'

const mockDialog = jest.fn()
jest.mock('@/components/assets/dialog', () => (props: any) => mockDialog(props))

jest.mock('../..', () => ({
  addOnCursor: jest.fn
}))

describe('components/editor/blobs/mesh', () => {
  beforeEach(() => {
    mockDialog.mockReset()
    mockDialog.mockImplementation(() => <div />)
  })

  test('render', () => {
    const { unmount } = render(<Sensors />)

    unmount()
  })

  test('button', () => {
    const { unmount } = render(<Sensors />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    unmount()
  })

  test('onCancel', () => {
    mockDialog.mockImplementation((props) => (
      <div role="Dialog" onClick={props.onCancel} />
    ))
    const { unmount } = render(<Sensors />)

    const dialog = screen.getByRole('Dialog')
    fireEvent.click(dialog)

    unmount()
  })

  test('onAdd', () => {
    mockDialog.mockImplementation((props) => (
      <div role="Dialog" onClick={props.onOk} />
    ))
    const { unmount } = render(<Sensors />)

    const dialog = screen.getByRole('Dialog')
    fireEvent.click(dialog)

    unmount()
  })
})
