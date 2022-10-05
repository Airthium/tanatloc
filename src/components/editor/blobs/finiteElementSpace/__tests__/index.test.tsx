import { fireEvent, render, screen } from '@testing-library/react'
import { Form } from 'antd'
import FiniteElementSpace from '..'

const mockDialog = jest.fn()
jest.mock('@/components/assets/dialog', () => (props: any) => mockDialog(props))

jest.mock('../..', () => ({
  addOnCursor: jest.fn
}))

describe('components/editor/blobs/finiteElementSpace', () => {
  beforeEach(() => {
    mockDialog.mockReset()
    mockDialog.mockImplementation(() => <div />)
  })

  test('render', () => {
    const { unmount } = render(<FiniteElementSpace />)

    unmount()
  })

  test('open', () => {
    const { unmount } = render(<FiniteElementSpace />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    unmount()
  })

  test('onCancel', () => {
    mockDialog.mockImplementation((props) => (
      <div role="Dialog" onClick={props.onCancel} />
    ))
    const { unmount } = render(<FiniteElementSpace />)

    const button = screen.getByRole('Dialog')
    fireEvent.click(button)

    unmount()
  })

  test('onOk', () => {
    // Empty
    mockDialog.mockImplementation((props) => (
      <div role="Dialog" onClick={() => props.onOk({})} />
    ))
    const { rerender, unmount } = render(<FiniteElementSpace />)

    let button = screen.getByRole('Dialog')
    fireEvent.click(button)

    // No length
    mockDialog.mockImplementation((props) => (
      <div
        role="Dialog"
        onClick={() => props.onOk({ name: 'name', options: [] })}
      />
    ))
    rerender(<FiniteElementSpace />)
    button = screen.getByRole('Dialog')
    fireEvent.click(button)

    // Length
    mockDialog.mockImplementation((props) => (
      <div
        role="Dialog"
        onClick={() =>
          props.onOk({
            name: 'name',
            options: [{ label: 'label', value: 'value', value2D: 'value2D' }]
          })
        }
      />
    ))
    rerender(<FiniteElementSpace />)
    button = screen.getByRole('Dialog')
    fireEvent.click(button)

    unmount()
  })

  test('form', () => {
    mockDialog.mockImplementation((props) => <div>{props.children}</div>)
    const { unmount } = render(
      <Form>
        <FiniteElementSpace />
      </Form>
    )

    const add = screen.getByRole('button', { name: 'plus Add data' })
    fireEvent.click(add)

    const remove = screen.getByRole('img', { name: 'minus-circle' })
    fireEvent.click(remove)

    unmount()
  })
})
