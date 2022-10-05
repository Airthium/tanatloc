import { fireEvent, render, screen } from '@testing-library/react'
import FiniteElementFunction from '..'

const mockDialog = jest.fn()
jest.mock('@/components/assets/dialog', () => (props: any) => mockDialog(props))

jest.mock('../..', () => ({
  addOnCursor: jest.fn
}))

describe('components/editor/blobs/finiteElementFunction', () => {
  beforeEach(() => {
    mockDialog.mockReset()
    mockDialog.mockImplementation(() => <div />)
  })

  test('render', () => {
    const { unmount } = render(<FiniteElementFunction />)

    unmount()
  })

  test('open', () => {
    const { unmount } = render(<FiniteElementFunction />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    unmount()
  })

  test('onCancel', () => {
    mockDialog.mockImplementation((props) => (
      <div role="Dialog" onClick={props.onCancel} />
    ))
    const { unmount } = render(<FiniteElementFunction />)

    const button = screen.getByRole('Dialog')
    fireEvent.click(button)

    unmount()
  })

  test('onOk', () => {
    mockDialog.mockImplementation((props) => (
      <div role="Dialog" onClick={() => props.onOk({})} />
    ))
    const { unmount } = render(<FiniteElementFunction />)

    const button = screen.getByRole('Dialog')
    fireEvent.click(button)

    unmount()
  })
})
