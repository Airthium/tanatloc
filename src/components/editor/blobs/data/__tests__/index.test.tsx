import { fireEvent, render, screen } from '@testing-library/react'
import { Form } from 'antd'

import Data from '..'

const mockDialog = jest.fn()
jest.mock('@/components/assets/dialog', () => (props: any) => mockDialog(props))

jest.mock('../..', () => ({
  addOnCursor: jest.fn
}))

describe('components/editor/blobs/data', () => {
  beforeEach(() => {
    mockDialog.mockReset()
    mockDialog.mockImplementation(() => <div />)
  })

  test('render', () => {
    const { unmount } = render(<Data />)

    unmount()
  })

  test('open', () => {
    const { unmount } = render(<Data />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    unmount()
  })

  test('onCancel', () => {
    mockDialog.mockImplementation((props) => (
      <div role="Dialog" onClick={props.onCancel} />
    ))
    const { unmount } = render(<Data />)

    const button = screen.getByRole('Dialog')
    fireEvent.click(button)

    unmount()
  })

  test('onOk', () => {
    // Empty
    mockDialog.mockImplementation((props) => (
      <div role="Dialog" onClick={() => props.onOk({})} />
    ))
    const { rerender, unmount } = render(<Data />)

    let button = screen.getByRole('Dialog')
    fireEvent.click(button)

    // No length
    mockDialog.mockImplementation((props) => (
      <div role="Dialog" onClick={() => props.onOk({ s: 'x', datas: [] })} />
    ))
    rerender(<Data />)
    button = screen.getByRole('Dialog')
    fireEvent.click(button)

    // Length
    mockDialog.mockImplementation((props) => (
      <div
        role="Dialog"
        onClick={() =>
          props.onOk({ s: 'x', datas: [{ name: 'name', y: 'y' }] })
        }
      />
    ))
    rerender(<Data />)
    button = screen.getByRole('Dialog')
    fireEvent.click(button)

    unmount()
  })

  test('form', () => {
    mockDialog.mockImplementation((props) => <div>{props.children}</div>)
    const { unmount } = render(
      <Form>
        <Data />
      </Form>
    )

    const add = screen.getByRole('button', { name: 'plus Add data' })
    fireEvent.click(add)

    const remove = screen.getByRole('img', { name: 'minus-circle' })
    fireEvent.click(remove)

    unmount()
  })
})
