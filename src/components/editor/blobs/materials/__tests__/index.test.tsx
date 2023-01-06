import { EditorContext } from '@/context/editor'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Form } from 'antd'

import Materials from '..'

const mockDialog = jest.fn()
jest.mock('@/components/assets/dialog', () => (props: any) => mockDialog(props))

jest.mock('../..', () => ({
  addOnCursor: jest.fn
}))

const contextValue = {
  template: "include('/blobs/materials.edp.ejs'",
  model: 'model',
  dispatch: jest.fn(),
  templateValid: true,
  modelValid: true
}

describe('components/editor/blobs/materials', () => {
  beforeEach(() => {
    mockDialog.mockReset()
    mockDialog.mockImplementation(() => <div />)
  })

  test('render', () => {
    const { unmount } = render(<Materials />)

    unmount()
  })

  test('open', () => {
    const { unmount } = render(<Materials />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    unmount()
  })

  test('onCancel', () => {
    mockDialog.mockImplementation((props) => (
      <div role="Dialog" onClick={props.onCancel} />
    ))
    const { unmount } = render(<Materials />)

    const dialog = screen.getByRole('Dialog')
    fireEvent.click(dialog)

    unmount()
  })

  test('onAdd', () => {
    // Empty
    mockDialog.mockImplementation((props) => (
      <div role="Dialog" onClick={() => props.onOk({})} />
    ))
    const { rerender, unmount } = render(<Materials />)

    let dialog = screen.getByRole('Dialog')
    fireEvent.click(dialog)

    // No length
    mockDialog.mockImplementation((props) => (
      <div role="Dialog" onClick={() => props.onOk({ materials: [] })} />
    ))
    rerender(<Materials />)

    dialog = screen.getByRole('Dialog')
    fireEvent.click(dialog)

    // Length
    mockDialog.mockImplementation((props) => (
      <div
        role="Dialog"
        onClick={() => props.onOk({ materials: [{ symbol: 0, default: 1 }] })}
      />
    ))
    rerender(<Materials />)

    dialog = screen.getByRole('Dialog')
    fireEvent.click(dialog)

    unmount()
  })

  test('onAdd, context', () => {
    mockDialog.mockImplementation((props) => (
      <div
        role="Dialog"
        onClick={() => props.onOk({ materials: [{ symbol: 0, default: 1 }] })}
      />
    ))
    const { unmount } = render(
      <EditorContext.Provider value={contextValue}>
        <Materials />
      </EditorContext.Provider>
    )

    const dialog = screen.getByRole('Dialog')
    fireEvent.click(dialog)

    unmount()
  })

  test('form', async () => {
    mockDialog.mockImplementation((props) => <div>{props.children}</div>)

    const { unmount } = render(
      <Form>
        <Materials />
      </Form>
    )

    const add = screen.getByRole('button', { name: 'plus Add material' })
    await act(() => fireEvent.click(add))

    await waitFor(() => screen.getByRole('img', { name: 'minus-circle' }))

    const remove = screen.getByRole('img', { name: 'minus-circle' })
    await act(() => fireEvent.click(remove))

    unmount()
  })
})
