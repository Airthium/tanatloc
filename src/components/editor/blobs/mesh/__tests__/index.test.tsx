import { EditorContext } from '@/context/editor'
import { fireEvent, render, screen } from '@testing-library/react'

import Mesh from '..'

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
    const { unmount } = render(<Mesh />)

    unmount()
  })

  test('button', () => {
    const { unmount } = render(<Mesh />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    unmount()
  })

  test('onCancel', () => {
    mockDialog.mockImplementation((props) => (
      <div role="Dialog" onClick={props.onCancel} />
    ))
    const { unmount } = render(<Mesh />)

    const dialog = screen.getByRole('Dialog')
    fireEvent.click(dialog)

    unmount()
  })

  test('onAdd', () => {
    mockDialog.mockImplementation((props) => (
      <div role="Dialog" onClick={props.onOk} />
    ))
    const { unmount } = render(<Mesh />)

    const dialog = screen.getByRole('Dialog')
    fireEvent.click(dialog)

    unmount()
  })

  test('onAdd, with context', () => {
    mockDialog.mockImplementation((props) => (
      <div role="Dialog" onClick={props.onOk} />
    ))
    const { unmount } = render(
      <EditorContext.Provider
        value={{
          template: "include('/blobs/mesh.edp.ejs'",
          model: '',
          dispatch: jest.fn(),
          templateValid: true,
          modelValid: true
        }}
      >
        <Mesh />
      </EditorContext.Provider>
    )

    const dialog = screen.getByRole('Dialog')
    fireEvent.click(dialog)

    unmount()
  })
})
