import { fireEvent, render, screen } from '@testing-library/react'
import Solver from '..'

const mockDialog = jest.fn()
jest.mock('@/components/assets/dialog', () => (props: any) => mockDialog(props))

jest.mock('../..', () => ({
  addOnCursor: jest.fn
}))

describe('components/editor/blobs/macros', () => {
  beforeEach(() => {
    mockDialog.mockReset()
    mockDialog.mockImplementation(() => <div />)
  })

  test('render', () => {
    const { unmount } = render(<Solver />)

    unmount()
  })

  test('open', () => {
    const { unmount } = render(<Solver />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    unmount()
  })

  test('onCancel', () => {
    mockDialog.mockImplementation((props) => (
      <div role="Dialog" onClick={props.onCancel} />
    ))
    const { unmount } = render(<Solver />)

    const button = screen.getByRole('Dialog')
    fireEvent.click(button)

    unmount()
  })

  test('onOk', () => {
    mockDialog.mockImplementation((props) => (
      <div role="Dialog" onClick={() => props.onOk({ solvers: ['solver'] })} />
    ))
    const { unmount } = render(<Solver />)

    const button = screen.getByRole('Dialog')
    fireEvent.click(button)

    unmount()
  })
})
