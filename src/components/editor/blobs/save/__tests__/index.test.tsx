import { fireEvent, render, screen } from '@testing-library/react'
import { Form } from 'antd'

import Save from '..'

const mockDialog = jest.fn()
jest.mock('@/components/assets/dialog', () => (props: any) => mockDialog(props))

jest.mock('../..', () => ({
  addOnCursor: jest.fn
}))

describe('components/editor/blobs/save', () => {
  beforeEach(() => {
    mockDialog.mockReset()
    mockDialog.mockImplementation(() => <div />)
  })

  test('render', () => {
    const { unmount } = render(<Save />)

    unmount()
  })

  test('open', () => {
    const { unmount } = render(<Save />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    unmount()
  })

  test('onCancel', () => {
    mockDialog.mockImplementation((props) => (
      <div role="Dialog" onClick={props.onCancel} />
    ))
    const { unmount } = render(<Save />)

    const button = screen.getByRole('Dialog')
    fireEvent.click(button)

    unmount()
  })

  test('onOk', () => {
    // Empty
    mockDialog.mockImplementation((props) => (
      <div role="Dialog" onClick={() => props.onOk({})} />
    ))
    const { rerender, unmount } = render(<Save />)

    let button = screen.getByRole('Dialog')
    fireEvent.click(button)

    // No length
    mockDialog.mockImplementation((props) => (
      <div
        role="Dialog"
        onClick={() => props.onOk({ scalarResults: [], vectorialResults: [] })}
      />
    ))
    rerender(<Save />)
    button = screen.getByRole('Dialog')
    fireEvent.click(button)

    // Scalar result
    mockDialog.mockImplementation((props) => (
      <div
        role="Dialog"
        onClick={() =>
          props.onOk({
            scalarResults: [{ name: 'name', variable: 'variable' }]
          })
        }
      />
    ))
    rerender(<Save />)
    button = screen.getByRole('Dialog')
    fireEvent.click(button)

    // Vectorial result
    mockDialog.mockImplementation((props) => (
      <div
        role="Dialog"
        onClick={() =>
          props.onOk({
            vectorialResults: [
              {
                name: 'name',
                variable1: 'variable1',
                variable2: 'variable2',
                variable3: 'variable3'
              }
            ]
          })
        }
      />
    ))
    rerender(<Save />)
    button = screen.getByRole('Dialog')
    fireEvent.click(button)

    // Both
    mockDialog.mockImplementation((props) => (
      <div
        role="Dialog"
        onClick={() =>
          props.onOk({
            scalarResults: [{ name: 'name', variable: 'variable' }],
            vectorialResults: [
              {
                name: 'name',
                variable1: 'variable1',
                variable2: 'variable2',
                variable3: 'variable3'
              }
            ]
          })
        }
      />
    ))
    rerender(<Save />)
    button = screen.getByRole('Dialog')
    fireEvent.click(button)

    unmount()
  })

  test('form', () => {
    mockDialog.mockImplementation((props) => <div>{props.children}</div>)
    const { unmount } = render(
      <Form>
        <Save />
      </Form>
    )

    const addScalar = screen.getByRole('button', {
      name: 'plus Add scalar result'
    })
    fireEvent.click(addScalar)
    const addVectorial = screen.getByRole('button', {
      name: 'plus Add vectorial result'
    })
    fireEvent.click(addVectorial)

    const removes = screen.getAllByRole('img', { name: 'minus-circle' })
    removes.forEach((remove) => fireEvent.click(remove))

    unmount()
  })
})
